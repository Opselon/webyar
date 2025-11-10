// src/index.mjs
import { Router } from 'itty-router';
// ... other imports

// Import dashboard route handlers
import { handleDashboard } from './routes/dashboard.mjs';
import { handleDashboardPosts } from './routes/dashboard-posts.mjs';
import { handleDashboardSettings } from './routes/dashboard-settings.mjs'; // New handler

// Import dashboard API router and auth middleware
import dashboardApiRouter from './api/dashboard/router.mjs';
import { withPageAuth } from './api/dashboard/middleware.mjs';

const router = Router();

// --- Page Routes ---
// ... public routes

// --- Dashboard Routes (Protected) ---
router.get('/dashboard', (req, env, ctx) => handleDashboard(req, env, ctx));
router.get('/dashboard/posts', withPageAuth, (req, env, ctx) => handleDashboardPosts(req, env, ctx));
router.get('/dashboard/settings', withPageAuth, (req, env, ctx) => handleDashboardSettings(req, env, ctx));

// ... other routes

// Attach the dashboard API router
router.all('/api/dashboard/*', (request, env, ctx) => dashboardApiRouter.handle(request, env, ctx));

// ... rest of the file
export default {
  async fetch(request, env, ctx) {
    // ... Sentry and error handling logic
    try {
      return await router.handle(request, env, ctx);
    } catch (error) {
      // ... error handling
    }
  },
};
