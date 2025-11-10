// src/routes/services.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import servicesTemplate from '../templates/services.html';

export async function handleServices(request, env, ctx) {
    const seoData = generateSeoMeta({
        title: 'خدمات تخصصی سئو | مشاوره، سئو تکنیکال و محتوا',
        description: 'مجموعه کامل خدمات سئو شامل سئو داخلی، سئو خارجی، بهینه‌سازی فنی و استراتژی محتوا برای کسب‌وکار شما.',
        canonical: `${env.BASE_URL}/services`,
    });

    const stream = streamRenderedPage(servicesTemplate, {
        seo: seoData,
    });

    return streamHtml(stream);
}
