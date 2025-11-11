// src/utils/renderer.mjs
import { Eta } from 'eta';
import { html as htmlResponse } from './response.mjs';

// Template Imports
import layoutTemplate from '../templates/layout.html';
import indexTemplate from '../templates/index.html';
import servicesTemplate from '../templates/services.html';
import pricingTemplate from '../templates/pricing.html';
import blogTemplate from '../templates/blog.html';
import postTemplate from '../templates/post.html';
import contactTemplate from '../templates/contact.html';

const eta = new Eta({
    cache: true,
    views: import.meta.glob('../templates/**/*.html', { as: 'raw', eager: true }),
});

const templates = {
    'index.html': indexTemplate,
    'services.html': servicesTemplate,
    'pricing.html': pricingTemplate,
    'blog.html': blogTemplate,
    'post.html': postTemplate,
    'contact.html': contactTemplate,
    'layout.html': layoutTemplate,
};

function streamRenderedPage(contentTemplateString, data = {}) {
    const layoutParts = layoutTemplate.split('{{- it.content }}');
    const layoutTop = layoutParts[0];
    const layoutBottom = layoutParts[1];

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(eta.renderString(layoutTop, data)));
            controller.enqueue(encoder.encode(eta.renderString(contentTemplateString, data)));
            controller.enqueue(encoder.encode(eta.renderString(layoutBottom, data)));
            controller.close();
        },
    });
    return stream;
}

export function renderPage(templateName, data = {}) {
    const contentTemplate = templates[templateName];
    if (!contentTemplate) {
        throw new Error(`Template not found: ${templateName}`);
    }

    const renderData = {
        page: data.page || {},
        i18n: data.i18n || { lang: 'fa', t: key => key },
        ...data.contentData,
    };

    const stream = streamRenderedPage(contentTemplate, renderData);
    return htmlResponse(stream);
}
