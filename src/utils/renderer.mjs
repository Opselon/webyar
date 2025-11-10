// src/utils/renderer.mjs
import { Eta } from 'eta';
import layout from '../templates/layout.html'; // We'll split this up

// Split the layout into top and bottom parts for streaming
const layoutParts = layout.split('{{- it.content }}');
const layoutTop = layoutParts[0];
const layoutBottom = layoutParts[1];

const eta = new Eta({ cache: true });

/**
 * Renders an HTML page using a ReadableStream for optimal performance.
 * It streams the page in chunks: top layout, page content, and bottom layout.
 *
 * @param {string} contentTemplate - The Eta template string for the main content.
 * @param {object} data - The data to pass to the templates.
 * @param {object} data.seo - SEO metadata (title, description, canonical).
 * @param {object} [data.contentData] - Data specific to the content template.
 * @returns {ReadableStream} - A stream that constructs the HTML response.
 */
export function streamRenderedPage(contentTemplate, data = {}) {
  const seoData = {
    title: 'Default Title',
    description: 'Default Description',
    canonical: 'https://your-domain.com/',
    ...data.seo,
  };

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // 1. Render and stream the top part of the layout (head, header)
      const topHtml = eta.renderString(layoutTop, { seo: seoData });
      controller.enqueue(encoder.encode(topHtml));

      // 2. Render and stream the main page content
      const contentHtml = eta.renderString(contentTemplate, data.contentData || {});
      controller.enqueue(encoder.encode(contentHtml));

      // 3. Render and stream the bottom part of the layout (footer, scripts)
      // Note: No data is passed to the bottom part in this setup, but it could be.
      const bottomHtml = eta.renderString(layoutBottom, {});
      controller.enqueue(encoder.encode(bottomHtml));

      // Close the stream
      controller.close();
    },
  });

  return stream;
}
