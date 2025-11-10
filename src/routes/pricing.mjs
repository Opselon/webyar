// src/routes/pricing.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import pricingTemplate from '../templates/pricing.html';

export async function handlePricing(request, env, ctx) {
  const seoData = generateSeoMeta({
    title: 'تعرفه‌های سئو | پلن‌های قیمتی متناسب با کسب‌وکار شما',
    description: 'پلن‌های متنوع قیمتی خدمات سئو، از پکیج‌های پایه تا استراتژی‌های جامع برای شرکت‌های بزرگ.',
    canonical: `${env.BASE_URL}/pricing`,
  });

  const stream = streamRenderedPage(pricingTemplate, {
    seo: seoData,
  });

  return streamHtml(stream);
}
