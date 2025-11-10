// src/routes/index.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
// Note: cacheAndServe is not compatible with streaming out-of-the-box, so we disable it for now.
// A more advanced implementation would stream to KV first, then stream from KV.
import { generateSeoMeta } from '../utils/seo.mjs';
import indexTemplate from '../templates/index.html';

export async function handleIndex(request, env, ctx) {
    const seoData = generateSeoMeta({
        title: 'خدمات سئو حرفه‌ای | رتبه یک گوگل شوید',
        description: 'با خدمات تخصصی سئو ما، وب‌سایت خود را به صفحه اول گوگل بیاورید و فروش خود را افزایش دهید.',
        canonical: `${env.BASE_URL}/`,
    });

    const stream = streamRenderedPage(indexTemplate, {
        seo: seoData,
    });

    return streamHtml(stream);
}
