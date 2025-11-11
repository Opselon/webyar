// src/utils/sitemap.mjs
import { xml } from './response.mjs';

const SUPPORTED_LANGS = ['fa', 'en', 'ar'];

async function getSitemapPosts(env) {
    if (!env.DB) {
        return [];
    }
    try {
        const { results } = await env.DB.prepare("SELECT slug, lang, created_at FROM posts").all();
        return results || [];
    } catch (e) {
        return [];
    }
}

function generateXhtmlLinks(baseUrl, path) {
    let links = '';
    SUPPORTED_LANGS.forEach(lang => {
        links += `<xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}/${lang}${path}"/>`;
    });
    links += `<xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/fa${path}"/>`;
    return links;
}

function generateUrlEntry(url, lastmod, priority, xhtmlLinks) {
    return `<url><loc>${url}</loc>${xhtmlLinks}<lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
}

export async function handleSitemap(request, env) {
    const baseUrl = env.BASE_URL || "https://your-domain.com";
    const staticPages = [
        { path: '/', priority: '1.00' },
        { path: '/services', priority: '0.80' },
        { path: '/pricing', priority: '0.80' },
        { path: '/blog', priority: '0.70' },
        { path: '/contact', priority: '0.60' },
    ];

    const today = new Date().toISOString().split('T')[0];
    let sitemapEntries = '';

    staticPages.forEach(page => {
        const xhtmlLinks = generateXhtmlLinks(baseUrl, page.path);
        const primaryUrl = `${baseUrl}/fa${page.path}`;
        sitemapEntries += generateUrlEntry(primaryUrl, today, page.priority, xhtmlLinks);
    });

    const posts = await getSitemapPosts(env);
    const postGroups = posts.reduce((acc, post) => {
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

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemapEntries}</urlset>`;
    const response = xml(sitemapContent);
    response.headers.set('Cache-Control', 'public, max-age=86400');
    return response;
}
