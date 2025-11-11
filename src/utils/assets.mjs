// src/utils/assets.mjs
// FIXME: This is a mock implementation because the original file was missing.
// This function should handle serving static assets from the /assets/ directory.

/**
 * Mock function for serving assets.
 * Returns a 404 response for any asset request.
 * @param {Request} request - The incoming request.
 * @returns {Response} - A 404 Not Found response.
 */
export async function serveAsset(request) {
    const url = new URL(request.url);
    console.warn(`Asset not found (mock implementation): ${url.pathname}`);
    return new Response(`Asset not found: ${url.pathname}`, { status: 404 });
}
