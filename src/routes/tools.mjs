// src/routes/tools.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import toolsTemplate from '../templates/tools.html';

export async function handleTools(request, env, ctx) {
  const seoData = generateSeoMeta({
    title: 'ابزارهای رایگان سئو | تحلیل سریع و بهینه‌سازی سایت',
    description: 'از ابزارهای رایگان ما برای بررسی سرعت سایت، تولید متا تگ و تحلیل اولیه سئوی وب‌سایت خود استفاده کنید.',
    canonical: `${env.BASE_URL}/tools`,
  });

  const stream = streamRenderedPage(toolsTemplate, {
    seo: seoData,
  });

  return streamHtml(stream);
}
