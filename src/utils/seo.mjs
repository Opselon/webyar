// src/utils/seo.mjs

/**
 * Generates a standard SEO data object.
 * @param {object} options - SEO options.
 * @param {string} options.title - The title of the page.
 * @param {string} options.description - The meta description.
 * @param {string} options.canonical - The canonical URL.
 * @param {string} [options.image] - The Open Graph image URL.
 * @param {boolean} [options.noIndex=false] - If true, adds a noindex meta tag.
 * @returns {object} - A standardized SEO object.
 */
export function generateSeoMeta({ title, description, canonical, image, noIndex = false }) {
  const meta = {
    title: title || 'سئوکار حرفه‌ای | خدمات تخصصی سئو',
    description: description || 'با خدمات ما به رتبه یک گوگل برسید.',
    canonical: canonical || 'https://your-domain.com/',
    image: image,
    noIndex: noIndex,
  };

  if (noIndex) {
    meta.robots = 'noindex, nofollow';
  }

  return meta;
}
