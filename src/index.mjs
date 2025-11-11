// src/index.mjs
import { Router, error, withParams } from 'itty-router';
import { renderPage } from './utils/renderer.mjs';
import { withAuth, withPageAuth } from './api/dashboard/middleware.mjs';
import { handleApiRequest } from './api/api-handler.mjs';
import { serveAsset } from './utils/assets.mjs';
import { getTranslations } from './utils/i18n.mjs';
import { generateSeoMeta } from './utils/seo.mjs';
import { html } from './utils/response.mjs';

// --- ROUTER INITIALIZATION ---
const router = Router();

// --- MIDDLEWARE for LOCALIZATION ---
const withLocale = (req) => {
    const lang = req.params.lang || 'fa';
    req.i18n = getTranslations(lang);
    req.lang = req.i18n.lang;
    // Extract the base path without the language code for SEO functions
    req.basePath = new URL(req.url).pathname.replace(`/${req.lang}`, '') || '/';
};


// --- LOCALIZED PAGE ROUTES ---
const pageRouter = Router({ base: '/:lang' });
pageRouter.all('*', withLocale, withParams); // Apply middleware

pageRouter.get('/', (req, env) => renderPage('index.html', {
    page: generateSeoMeta({
        title: req.i18n.t('page_titles.home'),
        description: req.i18n.t('meta_descriptions.home'),
    }, req.i18n, req.basePath, env),
    i18n: req.i18n,
}));

pageRouter.get('/services', (req, env) => renderPage('services.html', {
    page: generateSeoMeta({
        title: req.i18n.t('page_titles.services'),
        description: req.i18n.t('meta_descriptions.services'),
    }, req.i18n, req.basePath, env),
    i18n: req.i18n,
}));

pageRouter.get('/pricing', (req, env) => renderPage('pricing.html', {
    page: generateSeoMeta({
        title: req.i18n.t('page_titles.pricing'),
        description: req.i18n.t('meta_descriptions.pricing'),
    }, req.i18n, req.basePath, env),
    i18n: req.i18n,
}));

pageRouter.get('/blog', (req, env) => renderPage('blog.html', {
    page: generateSeoMeta({
        title: req.i18n.t('page_titles.blog'),
        description: req.i18n.t('meta_descriptions.blog'),
    }, req.i18n, req.basePath, env),
    i18n: req.i18n,
}));

pageRouter.get('/blog/:slug', (req, env) => {
    const { slug } = req.params;
    return renderPage('post.html', {
        page: generateSeoMeta({
            title: `${req.i18n.t('blog.post_title_prefix', 'مقاله')}: ${slug}`,
        }, req.i18n, req.basePath, env),
        i18n: req.i18n,
        contentData: { post: { slug } },
    });
});

pageRouter.get('/contact', (req, env) => renderPage('contact.html', {
    page: generateSeoMeta({
        title: req.i18n.t('page_titles.contact'),
        description: req.i18n.t('meta_descriptions.contact'),
    }, req.i18n, req.basePath, env),
    i18n: req.i18n,
}));


// --- ROOT REDIRECTION ---
router.get('/', (req) => {
    const defaultLang = 'fa';
    const url = new URL(req.url);
    url.pathname = `/${defaultLang}${url.pathname === '/' ? '' : url.pathname}`;
    return Response.redirect(url.toString(), 302);
});

// --- ASSET SERVING, API, and DASHBOARD ROUTES ---
router.get('/assets/*', serveAsset);
router.all('/api/*', handleApiRequest);
router.get('/dashboard/login', (req, env, ctx) => renderPage('dashboard/login.html', { page: { title: 'ورود به پنل مدیریت' }, layout: 'dashboard/layout.html', noAuth: true }, env, ctx));
router.get('/dashboard', withPageAuth, (req, env, ctx) => renderPage('dashboard/index.html', { page: { title: 'داشبورد' }, layout: 'dashboard/layout.html' }, env, ctx));
router.get('/dashboard/posts', withPageAuth, (req, env, ctx) => renderPage('dashboard/posts.html', { page: { title: 'مدیریت پست‌ها' }, layout: 'dashboard/layout.html' }, env, ctx));
router.get('/dashboard/settings', withPageAuth, (req, env, ctx) => renderPage('dashboard/settings.html', { page: { title: 'تنظیمات سایت' }, layout: 'dashboard/layout.html' }, env, ctx));
router.get('/dashboard/ai-insights', withPageAuth, (req, env, ctx) => renderPage('dashboard/ai-insights.html', { page: { title: 'تحلیل سئو با هوش مصنوعی' }, layout: 'dashboard/layout.html' }, env, ctx));

// --- CONNECT THE PAGE ROUTER ---
router.all('/:lang/*', pageRouter.handle);

// --- 404 HANDLER ---
router.all('*', () => new Response('404, Not Found.', { status: 404 }));

// --- WORKER FETCH HANDLER ---
export default {
    async fetch(request, env, ctx) {
        try {
            return await router.handle(request, env, ctx);
        } catch (err) {
            console.error('Unhandled error:', err);
            return error(500, 'Internal Server Error');
        }
    }
};
