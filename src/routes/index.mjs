// src/routes/index.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html } from '../utils/response.mjs';
import { cacheResponse } from '../utils/cache.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import indexTemplate from '../templates/index.html';

async function renderIndexPage() {
    const seoData = generateSeoMeta({
        title: 'خدمات سئو حرفه‌ای | رتبه یک گوگل شوید',
        description: 'با خدمات تخصصی سئو ما، وب‌سایت خود را به صفحه اول گوگل بیاورید و فروش خود را افزایش دهید.',
        canonical: 'https://your-domain.com/',
    });

    const renderedHtml = renderPage(indexTemplate, {
        seo: seoData,
    });

    return html(renderedHtml);
}

export async function handleIndex(request) {
  // Cache the homepage for 1 hour (3600 seconds)
  return cacheResponse(request, renderIndexPage, 3600);
}
