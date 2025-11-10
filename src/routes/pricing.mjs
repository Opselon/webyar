// src/routes/pricing.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html } from '../utils/response.mjs';
import { cacheAndServe } from '../utils/cache.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import pricingTemplate from '../templates/pricing.html';

async function renderPricingPage(env) {
  const seoData = generateSeoMeta({
    title: 'تعرفه‌های سئو | پلن‌های قیمتی متناسب با کسب‌وکار شما',
    description: 'پلن‌های متنوع قیمتی خدمات سئو، از پکیج‌های پایه تا استراتژی‌های جامع برای شرکت‌های بزرگ.',
    canonical: `${env.BASE_URL}/pricing`,
  });

  const renderedHtml = renderPage(pricingTemplate, {
    seo: seoData,
  });

  return html(renderedHtml);
}

export async function handlePricing(request, env, ctx) {
    const cacheOptions = {
        kvCacheTtl: 86400, // Cache in KV for 24 hours
        browserCacheTtl: 3600, // Browser caches for 1 hour
        staleWhileRevalidate: 86400,
    };

    const handler = () => renderPricingPage(env);

    return cacheAndServe(request, env, ctx, handler, cacheOptions);
}
