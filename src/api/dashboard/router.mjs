// src/api/dashboard/router.mjs
import { Router } from 'itty-router';
import { handleNotFound, json } from '../../utils/response.mjs';
import { withAuth } from './middleware.mjs';

// Import handlers
import { handleLogin } from './auth.mjs';
import { getPosts, getPost, createPost, updatePost, deletePost } from './posts.mjs';
import { getSettings, updateSettings } from './settings.mjs'; // Import settings handlers
import { getDbStatus } from './db-status.mjs';

const dashboardApiRouter = Router({ base: '/api/dashboard' });

// --- Public Routes ---
dashboardApiRouter.post('/login', (req, env) => handleLogin(req, env));
dashboardApiRouter.get('/db-status', (req, env) => getDbStatus(req, env));

// --- Protected Routes ---
dashboardApiRouter.all('*', withAuth); // Apply auth middleware to all subsequent routes

// Auth status check
dashboardApiRouter.get('/status', (req) => json({ user: req.user }));

// Post Management
dashboardApiRouter.get('/posts', (req, env) => getPosts(req, env));
dashboardApiRouter.get('/posts/:id', (req, env) => getPost(req, env));
dashboardApiRouter.post('/posts', (req, env) => createPost(req, env));
dashboardApiRouter.put('/posts/:id', (req, env) => updatePost(req, env));
dashboardApiRouter.delete('/posts/:id', (req, env) => deletePost(req, env));

// Settings Management
dashboardApiRouter.get('/settings', (req, env) => getSettings(req, env));
dashboardApiRouter.put('/settings', (req, env) => updateSettings(req, env));

// 404 handler
dashboardApiRouter.all('*', () => handleNotFound());

export default dashboardApiRouter;
