// src/routes/services.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html } from '../utils/response.mjs';
import { cacheAndServe } from '../utils/cache.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import servicesTemplate from '../templates/services.html';

async function renderServicesPage(env) {
    const seoData = generateSeoMeta({
        title: 'خدمات تخصصی سئو | مشاوره، سئو تکنیکال و محتوا',
        description: 'مجموعه کامل خدمات سئو شامل سئو داخلی، سئو خارجی، بهینه‌سازی فنی و استراتژی محتوا برای کسب‌وکار شما.',
        canonical: `${env.BASE_URL}/services`,
    });

    const renderedHtml = renderPage(servicesTemplate, {
        seo: seoData,
    });

    return html(renderedHtml);
}

export async function handleServices(request, env, ctx) {
    // Static pages can have a longer cache time
    const cacheOptions = {
        kvCacheTtl: 86400, // Cache in KV for 24 hours
        browserCacheTtl: 3600, // Browser caches for 1 hour
        staleWhileRevalidate: 86400,
    };

    const handler = () => renderServicesPage(env);

    return cacheAndServe(request, env, ctx, handler, cacheOptions);
}
