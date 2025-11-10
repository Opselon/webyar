// src/api/dashboard/middleware.mjs
import { json } from '../../utils/response.mjs';
import { verifyJwt } from './auth.mjs';

/**
 * Middleware that protects routes by verifying authentication.
 * It supports two methods:
 * 1. JWT from an httpOnly 'token' cookie (for browser sessions).
 * 2. Basic Auth (for scripts and testing).
 */
async function authenticate(request, env) {
    // Priority 1: Check for JWT in cookie
    const cookieHeader = request.headers.get('Cookie');
    const token = cookieHeader?.match(/token=([^;]+)/)?.[1];
    if (token) {
        const userPayload = await verifyJwt(token, env.JWT_SECRET);
        if (userPayload) {
            request.user = userPayload;
            return true; // Authenticated
        }
    }

    // Priority 2: Check for Basic Auth header
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        const [scheme, encoded] = authHeader.split(' ');
        if (scheme === 'Basic' && encoded) {
            const [user, pass] = atob(encoded).split(':');
            const ADMIN_USER = env.ADMIN_USER || 'admin';
            const ADMIN_PASS = env.ADMIN_PASS || 'password';
            if (user === ADMIN_USER && pass === ADMIN_PASS) {
                // For Basic Auth, we don't have a full user object,
                // so we create a basic one.
                request.user = { username: user, role: 'admin' };
                return true; // Authenticated
            }
        }
    }

    return false; // Not authenticated
}


// Middleware for API routes (returns JSON error)
export const withAuth = async (request, env) => {
    if (!(await authenticate(request, env))) {
        return json({ error: 'Unauthorized.' }, 401);
    }
};

// Middleware for Page routes (redirects)
export const withPageAuth = async (request, env) => {
    if (!(await authenticate(request, env))) {
        return new Response(null, {
            status: 302,
            headers: { 'Location': '/dashboard' },
        });
    }
};
