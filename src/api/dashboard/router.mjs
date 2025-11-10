// src/api/dashboard/router.mjs
import { Router } from 'itty-router';
import { handleNotFound, json } from '../../utils/response.mjs';
import { withAuth } from './middleware.mjs';

// Import handlers
import { handleLogin } from './auth.mjs';
import { getPosts, getPost, createPost, updatePost, deletePost } from './posts.mjs';
import { getSettings, updateSettings } from './settings.mjs';
import { handleSeoAnalysis } from '../analytics/seo.mjs';
import { getAiRecommendations } from '../ai/recommendations.mjs';
import { getDbStatus } from './db-status.mjs';

const dashboardApiRouter = Router({ base: '/api/dashboard' });

// --- Public Routes ---
dashboardApiRouter.post('/login', (req, env) => handleLogin(req, env));

// --- Protected Routes ---
dashboardApiRouter.all('*', withAuth);

// Auth status & health check
dashboardApiRouter.get('/status', (req) => json({ user: req.user }));
dashboardApiRouter.get('/db-status', (req, env) => getDbStatus(req, env));

// Post Management
dashboardApiRouter.get('/posts', (req, env) => getPosts(req, env));
dashboardApiRouter.get('/posts/:id', (req, env) => getPost(req, env));
dashboardApiRouter.post('/posts', (req, env) => createPost(req, env));
dashboardApiRouter.put('/posts/:id', (req, env) => updatePost(req, env));
dashboardApiRouter.delete('/posts/:id', (req, env) => deletePost(req, env));

// Settings Management
dashboardApiRouter.get('/settings', (req, env) => getSettings(req, env));
dashboardApiRouter.put('/settings', (req, env) => updateSettings(req, env));

// Stage 3: Analytics & Insights APIs
dashboardApiRouter.get('/analytics/seo', (req, env) => handleSeoAnalysis(req, env));
dashboardApiRouter.get('/ai/recommendations', (req, env) => getAiRecommendations(req, env));

// 404 handler
dashboardApiRouter.all('*', () => handleNotFound());

export default dashboardApiRouter;
