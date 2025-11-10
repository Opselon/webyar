// src/utils/cache.mjs

/**
 * A middleware-like function that implements a cache-then-network strategy
 * using the standard Cache API, compatible with streaming.
 * It sets Cache-Control headers to enable stale-while-revalidate.
 *
 * @param {Request} request - The incoming request.
 * @param {ExecutionContext} ctx - The execution context for waitUntil.
 * @param {function(): Promise<Response>} handler - The async function that generates a fresh response.
 * @param {object} options - Caching options.
 * @param {number} options.browserCacheTtl - TTL for browser/CDN cache (`max-age`).
 * @param {number} options.staleWhileRevalidate - Time window for serving stale content while revalidating.
 * @returns {Promise<Response>}
 */
export async function serveWithCache(request, ctx, handler, { browserCacheTtl, staleWhileRevalidate }) {
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);

    // Try to find the response in the cache
    let response = await cache.match(cacheKey);

    if (response) {
        // If found, return it but kick off a revalidation in the background
        // The headers on the cached response should already be correct.
        ctx.waitUntil(revalidateCache(cache, cacheKey, handler));

        // Add a debug header
        const newHeaders = new Headers(response.headers);
        newHeaders.set('X-Cache-Status', 'HIT');
        return new Response(response.body, { ...response, headers: newHeaders });
    }

    // If not in cache, generate a fresh response
    response = await handler();

    // Set the caching headers
    response.headers.set('Cache-Control', `public, max-age=${browserCacheTtl}, stale-while-revalidate=${staleWhileRevalidate}`);

    // Asynchronously cache the new response
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    response.headers.set('X-Cache-Status', 'MISS');
    return response;
}

/**
 * Fetches a fresh response and updates the cache.
 */
async function revalidateCache(cache, cacheKey, handler) {
    const freshResponse = await handler();
    freshResponse.headers.set('Cache-Control', freshResponse.headers.get('Cache-Control') || 'public, max-age=60, stale-while-revalidate=300'); // Ensure headers are set
    await cache.put(cacheKey, freshResponse);
}
