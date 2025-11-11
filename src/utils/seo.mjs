// src/utils/seo.mjs

const SUPPORTED_LANGS = ['fa', 'en', 'ar'];

function generateHreflangTags(baseUrl, path, currentLang) {
    let tags = '';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    SUPPORTED_LANGS.forEach(lang => {
        const url = `${baseUrl}/${lang}${cleanPath}`;
        tags += `    <link rel="alternate" hreflang="${lang}" href="${url}" />\n`;
    });

    const defaultLangUrl = `${baseUrl}/fa${cleanPath}`;
    tags += `    <link rel="alternate" hreflang="x-default" href="${defaultLangUrl}" />\n`;

    return tags;
}

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
        path: path
    };

    if (noIndex) {
        meta.robots = 'noindex, nofollow';
    }

    return meta;
}
