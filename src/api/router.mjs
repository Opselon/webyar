// src/api/router.mjs
import { Router } from 'itty-router';
import { json, handleNotFound } from '../utils/response.mjs';
import { getPosts, getPost, createPost, updatePost, deletePost } from './posts.mjs';

const apiRouter = Router({ base: '/api' });

// Simple, insecure authentication middleware (placeholder)
const authMiddleware = (request, env) => {
    // In a real app, use a more secure method like JWT
    // This token should be a secret
    const SECRET_TOKEN = env.API_TOKEN || 'my-secret-token';
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${SECRET_TOKEN}`) {
        return json({ error: 'Unauthorized' }, 401);
    }
};

// Pass env to handlers
const withEnv = (handler) => (request, env, ...args) => handler(request, env, ...args);

// Post routes - note that we now pass 'env' to each handler
apiRouter.get('/posts', (request, env) => getPosts(request, env));
apiRouter.get('/posts/:slug', (request, env) => getPost(request, env));
apiRouter.post('/posts', authMiddleware, (request, env) => createPost(request, env));
apiRouter.put('/posts/:slug', authMiddleware, (request, env) => updatePost(request, env));
apiRouter.delete('/posts/:slug', authMiddleware, (request, env) => deletePost(request, env));


// 404 handler for all other API routes
apiRouter.all('*', () => handleNotFound());

export default apiRouter;
