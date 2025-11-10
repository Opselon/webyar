// src/index.mjs
import { Router } from 'itty-router';
// ... other imports

// Import dashboard route handlers
import { handleDashboard } from './routes/dashboard.mjs';
import { handleDashboardPosts } from './routes/dashboard-posts.mjs';
import { handleDashboardSettings } from './routes/dashboard-settings.mjs';
import { handleDashboardInsights } from './routes/dashboard/ai-insights.mjs'; // The main insights route

// ... other imports

const router = Router();

// --- Dashboard Routes (Protected) ---
router.get('/dashboard', (req, env, ctx) => handleDashboard(req, env, ctx));
router.get('/dashboard/posts', withPageAuth, (req, env, ctx) => handleDashboardPosts(req, env, ctx));
router.get('/dashboard/settings', withPageAuth, (req, env, ctx) => handleDashboardSettings(req, env, ctx));
router.get('/dashboard/ai-insights', withPageAuth, (req, env, ctx) => handleDashboardInsights(req, env, ctx));

// ... rest of the file
// ...
