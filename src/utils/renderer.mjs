// src/utils/renderer.mjs
import { Eta } from 'eta';
import layout from '../templates/layout.html';
import * as path from 'path';

// Initialize Eta
const eta = new Eta({
  views: path.join(__dirname, '../templates'), // Not used by Worker but good practice
  cache: true,
});

/**
 * Renders a page by combining a content template with the main layout.
 * @param {string} contentTemplate - The content template string.
 * @param {object} data - The data to pass to the template.
 * @param {object} data.seo - SEO metadata (title, description, canonical).
 * @param {*} [data.contentData] - Data specific to the content template.
 * @returns {string} - The rendered HTML string.
 */
export function renderPage(contentTemplate, data = {}) {
  // Ensure default SEO object exists
  const seoData = {
    title: 'Default Title',
    description: 'Default Description',
    canonical: 'https://your-domain.com/',
    ...data.seo,
  };

  // First, render the specific page content
  const content = eta.renderString(contentTemplate, data.contentData || {});

  // Then, render the main layout, injecting the content and SEO data
  const finalHtml = eta.renderString(layout, {
    seo: seoData,
    content: content,
  });

  return finalHtml;
}
