// src/utils/seo.mjs

const SUPPORTED_LANGS = ['fa', 'en', 'ar'];

/**
 * Generates <link rel="alternate" hreflang="..."> tags as an HTML string.
 *
 * @param {string} baseUrl - The base URL of the site (e.g., https://your-domain.com).
 * @param {string} path - The current request's path, without the language prefix (e.g., /services).
 * @param {string} currentLang - The language of the current page.
 * @returns {string} - The HTML string of hreflang tags.
 */
function generateHreflangTags(baseUrl, path, currentLang) {
    let tags = '';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Add hreflang for each supported language
    SUPPORTED_LANGS.forEach(lang => {
        const url = `${baseUrl}/${lang}${cleanPath}`;
        tags += `    <link rel="alternate" hreflang="${lang}" href="${url}" />\n`;
    });

    // Add x-default hreflang tag pointing to the default language (e.g., 'fa')
    const defaultLangUrl = `${baseUrl}/fa${cleanPath}`;
    tags += `    <link rel="alternate" hreflang="x-default" href="${defaultLangUrl}" />\n`;

    return tags;
}


/**
 * Generates a standard SEO data object, now including hreflang tags.
 *
 * @param {object} options - SEO options.
 * @param {string} options.title - The title of the page.
 * @param {string} options.description - The meta description.
 * @param {string} options.canonical - The canonical URL for the *current language*.
 * @param {string} [options.image] - The Open Graph image URL.
 * @param {boolean} [options.noIndex=false] - If true, adds a noindex meta tag.
 * @param {object} i18n - The i18n object from the request.
 * @param {string} i18n.lang - The current language code.
 * @param {function} i18n.t - The translation function.
 * @param {string} path - The URL path *without* the language code (e.g., /services).
 * @param {object} env - The Cloudflare environment object.
 * @returns {object} - A standardized SEO object.
 */
export function generateSeoMeta({ title, description, image, noIndex = false }, i18n, path, env) {
    const baseUrl = env.BASE_URL || "https://your-domain.com";
    const canonical = `${baseUrl}/${i18n.lang}${path}`;

    const meta = {
        title: title || i18n.t('page_titles.home'),
        description: description || i18n.t('meta_descriptions.home'),
        canonical: canonical,
        image: image,
        noIndex: noIndex,
        hreflangTags: generateHreflangTags(baseUrl, path, i18n.lang),
        path: path // Pass path to be used in language switcher
    };

    if (noIndex) {
        meta.robots = 'noindex, nofollow';
    }

    return meta;
}
