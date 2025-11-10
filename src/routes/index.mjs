// src/routes/index.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html } from '../utils/response.mjs';
import { cacheAndServe } from '../utils/cache.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import indexTemplate from '../templates/index.html';

async function renderIndexPage(env) {
    const seoData = generateSeoMeta({
        title: 'خدمات سئو حرفه‌ای | رتبه یک گوگل شوید',
        description: 'با خدمات تخصصی سئو ما، وب‌سایت خود را به صفحه اول گوگل بیاورید و فروش خود را افزایش دهید.',
        canonical: `${env.BASE_URL}/`,
    });

    const renderedHtml = renderPage(indexTemplate, {
        seo: seoData,
    });

    return html(renderedHtml);
}

export async function handleIndex(request, env, ctx) {
  // Define caching strategy
  const cacheOptions = {
    kvCacheTtl: 3600, // Cache in KV for 1 hour
    browserCacheTtl: 300, // Browser caches for 5 minutes
    staleWhileRevalidate: 600, // Stale for 10 minutes while revalidating
  };

  // The handler function needs to be wrapped to pass env
  const handler = () => renderIndexPage(env);

  return cacheAndServe(request, env, ctx, handler, cacheOptions);
}
