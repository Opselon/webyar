// src/utils/sitemap.mjs
import { xml } from './response.mjs';

// Fetches all post keys from KV and retrieves them
async function getSitemapPosts(env) {
    if (!env.POSTS) {
        return [];
    }
    const { keys } = await env.POSTS.list();
    const posts = await Promise.all(keys.map(key => env.POSTS.get(key.name, 'json')));
    return posts.filter(Boolean); // Filter out any null/undefined results
}

function generateUrlEntry(url, lastmod, priority) {
    return `
    <url>
        <loc>${url}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>${priority}</priority>
    </url>`;
}

export async function handleSitemap(request, env) {
  const baseUrl = env.BASE_URL || "https://your-domain.com";
  const staticPages = [
    { url: `${baseUrl}/`, lastmod: '2023-11-10', priority: '1.00' },
    { url: `${baseUrl}/services`, lastmod: '2023-11-10', priority: '0.80' },
    { url: `${baseUrl}/pricing`, lastmod: '2023-11-10', priority: '0.80' },
    { url: `${baseUrl}/blog`, lastmod: '2023-11-10', priority: '0.70' },
    { url: `${baseUrl}/contact`, lastmod: '2023-11-10', priority: '0.60' },
  ];

  const posts = await getSitemapPosts(env);
  const postEntries = posts.map(post =>
    generateUrlEntry(`${baseUrl}/blog/${post.slug}`, post.date, '0.90')
  ).join('');

  const staticEntries = staticPages.map(page =>
    generateUrlEntry(page.url, page.lastmod, page.priority)
  ).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticEntries}
    ${postEntries}
</urlset>`.trim();

  const response = xml(sitemapContent);
  // Cache the sitemap for 24 hours
  response.headers.set('Cache-Control', 'public, max-age=86400');

  return response;
}
