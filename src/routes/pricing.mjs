// src/routes/pricing.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html } from '../utils/response.mjs';
import pricingTemplate from '../templates/pricing.html';

export async function handlePricing(request) {
  const seoData = {
    title: 'تعرفه‌های سئو | پلن‌های قیمتی متناسب با کسب‌وکار شما',
    description: 'پلن‌های متنوع قیمتی خدمات سئو، از پکیج‌های پایه تا استراتژی‌های جامع برای شرکت‌های بزرگ.',
    canonical: 'https://your-domain.com/pricing',
  };

  const renderedHtml = renderPage(pricingTemplate, {
    seo: seoData,
  });

  return html(renderedHtml);
}
