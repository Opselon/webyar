// src/routes/index.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import { serveWithCache } from '../utils/cache.mjs'; // New cache utility
import { generateSeoMeta } from '../utils/seo.mjs';
import indexTemplate from '../templates/index.html';

export async function handleIndex(request, env, ctx) {
    const handler = async () => {
        const seoData = generateSeoMeta({
            title: 'خدمات سئو حرفه‌ای | رتبه یک گوگل شوید',
            description: 'با خدمات تخصصی سئو ما، وب‌سایت خود را به صفحه اول گوگل بیاورید و فروش خود را افزایش دهید.',
            canonical: `${env.BASE_URL}/`,
        });

        const stream = streamRenderedPage(indexTemplate, { seo: seoData });
        return streamHtml(stream);
    };

    return serveWithCache(request, ctx, handler, {
        browserCacheTtl: 300, // 5 minutes
        staleWhileRevalidate: 600, // 10 minutes
    });
}
