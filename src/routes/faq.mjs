// src/routes/faq.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import faqTemplate from '../templates/faq.html';

export async function handleFaq(request, env, ctx) {
  const seoData = generateSeoMeta({
    title: 'پرسش‌های متداول (FAQ) | پاسخ به سوالات شما درباره سئو',
    description: 'پاسخ به سوالات رایج در مورد خدمات سئو، هزینه‌ها، زمان‌بندی و نتایج مورد انتظار.',
    canonical: `${env.BASE_URL}/faq`,
  });

  const stream = streamRenderedPage(faqTemplate, {
    seo: seoData,
  });

  return streamHtml(stream);
}
