// src/api/router.mjs
import { Router } from 'itty-router';
import { json, handleNotFound } from '../utils/response.mjs';
import { getPosts, getPost, createPost, updatePost, deletePost } from './posts.mjs';
import { getDbStatus } from './db-status.mjs'; // Import the new handler

const apiRouter = Router({ base: '/api' });

// Middleware to check for Basic Auth credentials
const withAdminAuth = (request, env) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return json({ error: 'Unauthorized: Missing Authorization header' }, 401);
    }

    const [scheme, encoded] = authHeader.split(' ');
    if (scheme !== 'Basic' || !encoded) {
        return json({ error: 'Unauthorized: Invalid Authorization scheme' }, 401);
    }

    const ADMIN_USER = env.ADMIN_USER || 'admin';
    const ADMIN_PASS = env.ADMIN_PASS || 'password';

    const [user, pass] = atob(encoded).split(':');

    if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
        return json({ error: 'Unauthorized: Invalid credentials' }, 401);
    }
};

// --- Public Routes ---
// Health check for the database
apiRouter.get('/db-status', (request, env) => getDbStatus(request, env));

// Publicly accessible post routes
apiRouter.get('/posts', (request, env) => getPosts(request, env));
apiRouter.get('/posts/:id', (request, env) => getPost(request, env));

// --- Protected Admin Routes ---
apiRouter.post('/posts', withAdminAuth, (request, env) => createPost(request, env));
apiRouter.put('/posts/:id', withAdminAuth, (request, env) => updatePost(request, env));
apiRouter.delete('/posts/:id', withAdminAuth, (request, env) => deletePost(request, env));

// 404 handler for all other API routes
apiRouter.all('*', () => handleNotFound());

export default apiRouter;
