// src/routes/index.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import { serveWithCache } from '../utils/cache.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import { queryDb } from '../utils/db.mjs';
import { Eta } from 'eta';

// Import component templates as text
import heroTemplate from '../templates/components/hero.html';
import servicesTemplate from '../templates/components/services.html';
import testimonialsTemplate from '../templates/components/testimonials.html';
import blogPreviewTemplate from '../templates/components/blog-preview.html';

const eta = new Eta();

// Combine all components into a single homepage template
const homeTemplate = `${heroTemplate}${servicesTemplate}${testimonialsTemplate}${blogPreviewTemplate}`;

export async function handleIndex(request, env, ctx) {
    const handler = async () => {
        // Fetch dynamic data in parallel
        const [testimonialsResult, latestPostsResult] = await Promise.all([
            queryDb(env.DB, "SELECT name, company, message FROM testimonials WHERE is_featured = 1 LIMIT 3"),
            queryDb(env.DB, "SELECT title, slug, excerpt FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 3")
        ]);

        const contentData = {
            testimonials: testimonialsResult.results || [],
            latestPosts: latestPostsResult.results || []
        };

        const seoData = generateSeoMeta({
            title: 'خدمات سئو حرفه‌ای | رتبه یک گوگل شوید',
            description: 'با استراتژی‌های سئوی داده-محور، کسب‌وکار شما را در صفحه اول نتایج جستجو قرار می‌دهیم.',
            canonical: `${env.BASE_URL}/`,
        });

        // Use the main renderer, but pass our composed template and data
        const stream = streamRenderedPage(homeTemplate, {
            seo: seoData,
            contentData: contentData
        });

        return streamHtml(stream);
    };

    // Use the cache utility
    return serveWithCache(request, ctx, handler, {
        browserCacheTtl: 300,
        staleWhileRevalidate: 600,
    });
}
