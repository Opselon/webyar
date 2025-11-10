// src/index.mjs
import { Router, error, withParams } from 'itty-router';
import { renderPage } from './utils/renderer.mjs';
import { withAuth, withPageAuth } from './api/dashboard/auth-middleware.mjs';
import { handleApiRequest } from './api/api-handler.mjs';
import { serveAsset } from './utils/assets.mjs';

// --- ROUTER INITIALIZATION ---
const router = Router();
router.get('/', (req, env, ctx) => renderPage('index.html', {
    page: { title: 'خدمات سئو مدرن', description: 'ارائه دهنده خدمات تخصصی سئو برای کسب و کارهای آنلاین' },
    layout: 'layout.html'
}, env, ctx));
router.get('/services', (req, env, ctx) => renderPage('services.html', { page: { title: 'خدمات ما', description: 'خدمات جامع سئو شامل سئوی فنی، محتوا و لینک‌سازی' }, layout: 'layout.html' }, env, ctx));
router.get('/pricing', (req, env, ctx) => renderPage('pricing.html', { page: { title: 'تعرفه‌ها', description: 'پلن‌های قیمتی متناسب با نیاز کسب و کار شما' }, layout: 'layout.html' }, env, ctx));
router.get('/blog', (req, env, ctx) => renderPage('blog.html', { page: { title: 'وبلاگ', description: 'مقالات و آموزش‌های تخصصی در زمینه سئو' }, layout: 'layout.html' }, env, ctx));
router.get('/blog/:slug', withParams, (req, env, ctx) => {
    // This is a simplified example. In a real app, you'd fetch post data from D1.
    const { slug } = req.params;
    return renderPage('post.html', { page: { title: `مقاله: ${slug}` }, post: { slug } }, env, ctx);
});
router.get('/contact', (req, env, ctx) => renderPage('contact.html', { page: { title: 'تماس با ما', description: 'با ما در ارتباط باشید' }, layout: 'layout.html' }, env, ctx));

// --- ASSET SERVING ---
// Serve static assets from the /assets/ directory
router.get('/assets/*', serveAsset);


// --- API ROUTES ---
// This single handler will process all /api requests.
router.all('/api/*', handleApiRequest);


// --- DASHBOARD ROUTES (PROTECTED) ---
router.get('/dashboard/login', (req, env, ctx) => renderPage('dashboard/login.html', { page: { title: 'ورود به پنل مدیریت' }, layout: 'dashboard/layout.html', noAuth: true }, env, ctx));
router.get('/dashboard', withPageAuth, (req, env, ctx) => renderPage('dashboard/index.html', { page: { title: 'داشبورد' }, layout: 'dashboard/layout.html' }, env, ctx));
router.get('/dashboard/posts', withPageAuth, (req, env, ctx) => renderPage('dashboard/posts.html', { page: { title: 'مدیریت پست‌ها' }, layout: 'dashboard/layout.html' }, env, ctx));
router.get('/dashboard/settings', withPageAuth, (req, env, ctx) => renderPage('dashboard/settings.html', { page: { title: 'تنظیمات سایت' }, layout: 'dashboard/layout.html' }, env, ctx));
router.get('/dashboard/ai-insights', withPageAuth, (req, env, ctx) => renderPage('dashboard/ai-insights.html', { page: { title: 'تحلیل سئو با هوش مصنوعی' }, layout: 'dashboard/layout.html' }, env, ctx));

// --- 404 HANDLER ---
router.all('*', () => new Response('404, Not Found.', { status: 404 }));

// --- WORKER FETCH HANDLER ---
export default {
    async fetch(request, env, ctx) {
        try {
            return await router.handle(request, env, ctx);
        } catch (err) { {
            console.error('Unhandled error:', err);
            return error(500, 'Internal Server Error');
        }
    }
}
}
