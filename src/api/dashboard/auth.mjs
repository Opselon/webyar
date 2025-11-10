// src/api/dashboard/auth.mjs
import jwt from '@tsndr/cloudflare-worker-jwt';
import { json } from '../../utils/response.mjs';
import { queryDbFirst } from '../../utils/db.mjs';

// --- Helper Functions ---

/**
 * Hashes a password using SHA-256.
 * In a real-world app, use a stronger algorithm like Argon2 if possible,
 * but SHA-256 is a secure and built-in option in Workers.
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Verifies a JWT token. */
export async function verifyJwt(token, secret) {
    if (!token || !secret) return null;
    try {
        const valid = await jwt.verify(token, secret);
        if (valid) {
            return jwt.decode(token).payload;
        }
    } catch (e) {
        return null;
    }
    return null;
}

// --- Route Handlers ---

/**
 * Handles user login.
 * Validates credentials, and if successful, returns a JWT in an httpOnly cookie.
 */
export const handleLogin = async (request, env) => {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            return json({ error: 'Username and password are required.' }, 400);
        }

        const user = await queryDbFirst(env.DB, 'SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            return json({ error: 'Invalid credentials.' }, 401);
        }

        // IMPORTANT: In a real app, you would compare hashed passwords.
        // This requires a password hashing function during user creation.
        // For this example, we'll assume a placeholder check.
        // const passwordHash = await hashPassword(password);
        // if (user.password_hash !== passwordHash) {
        //   return json({ error: 'Invalid credentials.' }, 401);
        // }
        // For now, using a placeholder hash:
        if (user.password_hash !== 'placeholder_hash') {
             return json({ error: 'Invalid credentials (password check).' }, 401);
        }

        // Credentials are valid, create a JWT
        const token = await jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // 8-hour expiration
        }, env.JWT_SECRET);

        const headers = {
            'Set-Cookie': `token=${token}; HttpOnly; Secure; Path=/; SameSite=Strict`,
        };

        return json({ success: true, message: 'Logged in successfully.' }, 200, headers);

    } catch (e) {
        return json({ error: 'An unexpected error occurred.', details: e.message }, 500);
    }
};
