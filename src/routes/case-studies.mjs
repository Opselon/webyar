// src/routes/case-studies.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import caseStudiesTemplate from '../templates/case-studies.html';

export async function handleCaseStudies(request, env, ctx) {
  // Mock data for now. Will be fetched from D1 later.
  const mockCaseStudies = [
    { slug: 'client-a-success', title: 'افزایش ۳۰۰٪ ترافیک ارگانیک برای مشتری A', client: 'شرکت A', excerpt: 'چگونه با استراتژی سئوی محتوایی، ترافیک شرکت A را در ۶ ماه سه برابر کردیم.' },
    { slug: 'client-b-ecommerce', title: 'رشد فروش فروشگاه اینترنتی مشتری B', client: 'فروشگاه B', excerpt: 'بهینه‌سازی سئوی تکنیکال و محصول چگونه منجر به افزایش فروش شد.' },
  ];

  const seoData = generateSeoMeta({
    title: 'مطالعات موردی (Case Studies) | نتایج واقعی پروژه‌های سئو',
    description: 'مشاهده کنید چگونه ما به کسب‌وکارهای مختلف کمک کرده‌ایم تا به اهداف سئوی خود دست پیدا کنند.',
    canonical: `${env.BASE_URL}/case-studies`,
  });

  const stream = streamRenderedPage(caseStudiesTemplate, {
    seo: seoData,
    contentData: { caseStudies: mockCaseStudies },
  });

  return streamHtml(stream);
}
