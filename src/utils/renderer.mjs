// src/utils/renderer.mjs
import { Eta } from 'eta';
import { html as htmlResponse } from './response.mjs';

// --- TEMPLATE IMPORTS ---
// Layouts
import layoutTemplate from '../templates/layout.html';
// Pages
import indexTemplate from '../templates/index.html';
import servicesTemplate from '../templates/services.html';
import pricingTemplate from '../templates/pricing.html';
import blogTemplate from '../templates/blog.html';
import postTemplate from '../templates/post.html';
import contactTemplate from '../templates/contact.html';
// Dashboard templates are handled separately and are not part of this flow.

// --- ETA INITIALIZATION ---
const eta = new Eta({
    cache: true,
    views: import.meta.glob('../templates/**/*.html', { as: 'raw', eager: true }), // For includes/partials
});

// --- TEMPLATE MAPPING ---
const templates = {
    'index.html': indexTemplate,
    'services.html': servicesTemplate,
    'pricing.html': pricingTemplate,
    'blog.html': blogTemplate,
    'post.html': postTemplate,
    'contact.html': contactTemplate,
    'layout.html': layoutTemplate,
};

/**
 * Renders an HTML page using a ReadableStream for optimal performance.
 * It streams the page in chunks: top layout, page content, and bottom layout.
 *
 * @param {string} contentTemplateString The main content template as a string.
 * @param {object} data The combined data object for rendering.
 * @returns {ReadableStream} A stream that constructs the HTML response.
 */
function streamRenderedPage(contentTemplateString, data = {}) {
    // Split the layout into top and bottom parts for streaming
    const layoutParts = layoutTemplate.split('{{- it.content }}');
    const layoutTop = layoutParts[0];
    const layoutBottom = layoutParts[1];

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            // Render and stream the top part of the layout (head, header)
            const topHtml = eta.renderString(layoutTop, data);
            controller.enqueue(encoder.encode(topHtml));

            // Render and stream the main page content
            const contentHtml = eta.renderString(contentTemplateString, data);
            controller.enqueue(encoder.encode(contentHtml));

            // Render and stream the bottom part of the layout (footer, scripts)
            const bottomHtml = eta.renderString(layoutBottom, data);
            controller.enqueue(encoder.encode(bottomHtml));

            controller.close();
        },
    });

    return stream;
}

/**
 * High-level function to render a full page response.
 * It selects the template, prepares data, and returns a streaming response.
 *
 * @param {string} templateName The key of the template to render (e.g., 'index.html').
 * @param {object} data The data object from the route handler.
 * @returns {Response} A streaming HTML response.
 */
export function renderPage(templateName, data = {}) {
    const contentTemplate = templates[templateName];
    if (!contentTemplate) {
        throw new Error(`Template not found: ${templateName}`);
    }

    // Prepare a unified data object for Eta
    const renderData = {
        page: data.page || {},
        i18n: data.i18n || { lang: 'fa', t: key => key }, // Fallback i18n
        ...data.contentData, // Any other specific data
    };

    const stream = streamRenderedPage(contentTemplate, renderData);

    return htmlResponse(stream);
}
