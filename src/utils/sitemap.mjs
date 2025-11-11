// src/utils/sitemap.mjs
import { xml } from './response.mjs';

const SUPPORTED_LANGS = ['fa', 'en', 'ar'];

/**
 * Fetches all posts from the D1 database.
 * This function assumes posts will have a 'lang' and 'slug' column.
 * @param {object} env - The Cloudflare environment.
 * @returns {Promise<Array>} - A promise that resolves to an array of post objects.
 */
async function getSitemapPosts(env) {
    if (!env.DB) {
        console.warn('D1 database binding (DB) not found. Sitemap will not include posts.');
        return [];
    }
    try {
        const { results } = await env.DB.prepare("SELECT slug, lang, created_at FROM posts").all();
        return results || [];
    } catch (e) {
        console.error("Error fetching posts from D1 for sitemap:", e);
        return [];
    }
}

/**
 * Generates <xhtml:link> tags for alternate language versions of a URL.
 * @param {string} baseUrl - The base URL of the site.
 * @param {string} path - The path of the page (e.g., /services).
 * @returns {string} - The generated <xhtml:link> tags as a string.
 */
function generateXhtmlLinks(baseUrl, path) {
    let links = '';
    SUPPORTED_LANGS.forEach(lang => {
        links += `
        <xhtml:link
            rel="alternate"
            hreflang="${lang}"
            href="${baseUrl}/${lang}${path}"
        />`;
    });
    // Add x-default link
    links += `
        <xhtml:link
            rel="alternate"
            hreflang="x-default"
            href="${baseUrl}/fa${path}"
        />`;
    return links;
}

/**
 * Generates a single <url> entry for the sitemap.
 * @param {string} url - The full URL of the page.
 * @param {string} lastmod - The last modification date (YYYY-MM-DD).
 * @param {string} priority - The priority of the page (0.0 to 1.0).
 * @param {string} xhtmlLinks - The <xhtml:link> tags for this URL.
 * @returns {string} - The generated <url> entry as a string.
 */
function generateUrlEntry(url, lastmod, priority, xhtmlLinks) {
    return `
    <url>
        <loc>${url}</loc>${xhtmlLinks}
        <lastmod>${lastmod}</lastmod>
        <priority>${priority}</priority>
    </url>`;
}

export async function handleSitemap(request, env) {
    const baseUrl = env.BASE_URL || "https://your-domain.com";

    // Define static pages without language prefix
    const staticPages = [
        { path: '/', priority: '1.00' },
        { path: '/services', priority: '0.80' },
        { path: '/pricing', priority: '0.80' },
        { path: '/blog', priority: '0.70' },
        { path: '/contact', priority: '0.60' },
    ];

    const today = new Date().toISOString().split('T')[0];
    let sitemapEntries = '';

    // Generate entries for each static page in each language
    staticPages.forEach(page => {
        const xhtmlLinks = generateXhtmlLinks(baseUrl, page.path);
        // We only need one <url> entry per set of language variations,
        // but we'll point the <loc> to the default language version.
        const primaryUrl = `${baseUrl}/fa${page.path}`;
        sitemapEntries += generateUrlEntry(primaryUrl, today, page.priority, xhtmlLinks);
    });

    // Generate entries for dynamic content (blog posts)
    const posts = await getSitemapPosts(env);
    const postGroups = posts.reduce((acc, post) => {
        // Group posts by slug, assuming slugs are the same across languages
        acc[post.slug] = acc[post.slug] || [];
        acc[post.slug].push(post);
        return acc;
    }, {});

    Object.values(postGroups).forEach(group => {
        const firstPost = group[0];
        const path = `/blog/${firstPost.slug}`;
        const lastmod = firstPost.created_at ? firstPost.created_at.split(' ')[0] : today;
        const xhtmlLinks = generateXhtmlLinks(baseUrl, path);
        const primaryUrl = `${baseUrl}/fa${path}`;
        sitemapEntries += generateUrlEntry(primaryUrl, lastmod, '0.90', xhtmlLinks);
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemapEntries}
</urlset>`.trim();

    const response = xml(sitemapContent);
    response.headers.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    return response;
}
