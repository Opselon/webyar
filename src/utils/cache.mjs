// src/utils/cache.mjs

/**
 * Caches a response in KV storage and sets appropriate browser/CDN cache headers.
 * It first tries to retrieve a response from KV. If not found, it generates a new
 * response using the provided handler, caches it in KV, and returns it.
 *
 * @param {Request} request - The incoming request, used as the cache key.
 * @param {object} env - The worker environment containing the CACHE_KV binding.
 * @param {object} ctx - The execution context, used for async operations.
 * @param {function(): Promise<Response>} handler - An async function that generates the response to be cached.
 * @param {object} options - Caching options.
 * @param {number} options.kvCacheTtl - TTL for the KV cache in seconds.
 * @param {number} options.browserCacheTtl - TTL for the browser cache (`max-age`).
 * @param {number} [options.staleWhileRevalidate] - TTL for `stale-while-revalidate`.
 * @returns {Promise<Response>}
 */
export async function cacheAndServe(request, env, ctx, handler, { kvCacheTtl, browserCacheTtl, staleWhileRevalidate }) {
  // Use the URL as the cache key
  const cacheKey = request.url;

  // Try to get the cached response from KV
  const cachedResponse = await env.CACHE_KV.get(cacheKey, 'text');

  if (cachedResponse) {
    // If found, create a response from the cached text
    const response = new Response(cachedResponse, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'X-Cache-Status': 'HIT' // Custom header to indicate a KV cache hit
      },
    });
    // Set cache headers on the response
    setCacheHeaders(response, browserCacheTtl, staleWhileRevalidate);
    return response;
  }

  // If not found in cache, generate a new response
  const newResponse = await handler();

  // Only cache successful responses
  if (newResponse.status === 200) {
    // Asynchronously store the new response in KV
    // We use waitUntil to avoid blocking the response to the user
    const body = await newResponse.clone().text();
    ctx.waitUntil(env.CACHE_KV.put(cacheKey, body, { expirationTtl: kvCacheTtl }));

    // Set cache headers on the new response
    setCacheHeaders(newResponse, browserCacheTtl, staleWhileRevalidate);
    newResponse.headers.set('X-Cache-Status', 'MISS');
  }

  return newResponse;
}

/**
 * Sets Cache-Control headers on a Response object.
 * @param {Response} response - The response object to modify.
 * @param {number} maxAge - The `max-age` value in seconds.
 * @param {number} [staleWhileRevalidate] - The `stale-while-revalidate` value.
 */
function setCacheHeaders(response, maxAge, staleWhileRevalidate) {
  let cacheControl = `public, max-age=${maxAge}`;
  if (staleWhileRevalidate) {
    cacheControl += `, stale-while-revalidate=${staleWhileRevalidate}`;
  }
  response.headers.set('Cache-Control', cacheControl);
}
