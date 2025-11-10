// src/api/dashboard/middleware.mjs
import { json } from '../../utils/response.mjs';
import { verifyJwt } from './auth.mjs';

async function authenticate(request, env) {
    const cookieHeader = request.headers.get('Cookie');
    const token = cookieHeader?.match(/token=([^;]+)/)?.[1];
    if (token) {
        const userPayload = await verifyJwt(token, env.JWT_SECRET);
        if (userPayload) {
            request.user = userPayload;
            return true;
        }
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        const [scheme, encoded] = authHeader.split(' ');
        if (scheme === 'Basic' && encoded) {
            const [user, pass] = atob(encoded).split(':');
            const ADMIN_USER = env.ADMIN_USER || 'admin';
            const ADMIN_PASS = env.ADMIN_PASS || 'password';
            if (user === ADMIN_USER && pass === ADMIN_PASS) {
                request.user = { username: user, role: 'admin' };
                return true;
            }
        }
    }

    return false;
}

export const withAuth = async (request, env) => {
    if (!(await authenticate(request, env))) {
        return json({ error: 'Unauthorized.' }, 401);
    }
};

export const withPageAuth = async (request, env) => {
    if (!(await authenticate(request, env))) {
        return new Response(null, {
            status: 302,
            headers: { 'Location': '/dashboard' },
        });
    }
};
