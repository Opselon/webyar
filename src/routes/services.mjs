// src/routes/services.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html } from '../utils/response.mjs';
import { cacheResponse } from '../utils/cache.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import servicesTemplate from '../templates/services.html';


async function renderServicesPage() {
    const seoData = generateSeoMeta({
        title: 'خدمات تخصصی سئو | مشاوره، سئو تکنیکال و محتوا',
        description: 'مجموعه کامل خدمات سئو شامل سئو داخلی، سئو خارجی، بهینه‌سازی فنی و استراتژی محتوا برای کسب‌وکار شما.',
        canonical: 'https://your-domain.com/services',
    });

    const renderedHtml = renderPage(servicesTemplate, {
        seo: seoData,
    });

    return html(renderedHtml);
}

export async function handleServices(request) {
    // Cache the services page for 1 hour (3600 seconds)
    return cacheResponse(request, renderServicesPage, 3600);
}
