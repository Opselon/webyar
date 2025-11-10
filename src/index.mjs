// src/index.mjs
import { Router } from 'itty-router';
import { Toucan } from 'toucan-js';

// Import route handlers
import { handleIndex } from './routes/index.mjs';
import { handleServices } from './routes/services.mjs';
import { handlePricing } from './routes/pricing.mjs';
import { handleBlog, handleBlogPost } from './routes/blog.mjs';
import { handleContact } from './routes/contact.mjs';
import { handleDashboard } from './routes/dashboard.mjs';

// Import API handlers
import apiRouter from './api/router.mjs';

// Import utility handlers
import { handleNotFound, handleError } from './utils/response.mjs';
import { handleSitemap } from './utils/sitemap.mjs';
import { handleRobots } from './utils/robots.mjs';
import { sentryOptions } from './utils/sentry.mjs'

const router = Router();

// Page Routes
router.get('/', (req, env, ctx) => handleIndex(req, env, ctx));
router.get('/services', (req, env, ctx) => handleServices(req, env, ctx));
router.get('/pricing', (req, env, ctx) => handlePricing(req, env, ctx));
router.get('/blog', (req, env, ctx) => handleBlog(req, env, ctx));
router.get('/blog/:slug', (req, env, ctx) => handleBlogPost(req, env, ctx));
router.get('/contact', (req, env, ctx) => handleContact(req, env, ctx));
router.post('/contact', (req, env, ctx) => handleContact(req, env, ctx)); // For form submission
router.get('/dashboard', (req, env, ctx) => handleDashboard(req, env, ctx));

// SEO Routes
router.get('/sitemap.xml', (req, env, ctx) => handleSitemap(req, env, ctx));
router.get('/robots.txt', (req, env, ctx) => handleRobots(req, env, ctx));

// API Router
router.all('/api/*', apiRouter.handle);

// 404 Handler
router.all('*', handleNotFound);

export default {
  async fetch(request, env, ctx) {
    const sentry = new Toucan({
      ...sentryOptions,
      request,
      ctx,
    });

    try {
      // Pass env and ctx to all handlers
      return await router.handle(request, env, ctx);
    } catch (error) {
      sentry.captureException(error);
      return handleError(error);
    }
  },
};
