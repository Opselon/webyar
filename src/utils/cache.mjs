// src/utils/cache.mjs

/**
 * A middleware-like function to cache responses using Cloudflare's Cache API.
 * It checks for a cached response first and caches the new response if not found.
 * @param {Request} request - The incoming request.
 * @param {function} handle - The async function that generates the response.
 * @param {number} ttlSeconds - The Time To Live for the cache in seconds.
 * @returns {Promise<Response>}
 */
export async function cacheResponse(request, handle, ttlSeconds) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);

  let response = await cache.match(cacheKey);

  if (!response) {
    response = await handle();
    // Only cache successful responses
    if (response.status === 200) {
      response.headers.set('Cache-Control', `public, max-age=${ttlSeconds}`);
      // Use ctx.waitUntil to cache asynchronously
      // In this context, we'll just call it directly.
      // In the main worker file, this should be wrapped in ctx.waitUntil
      cache.put(cacheKey, response.clone()).catch(err => console.error(err));
    }
  } else {
    // Add a header to indicate the response is from cache
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Cache-Status', 'HIT');
    response = new Response(response.body, {
      ...response,
      headers: newHeaders,
    });
  }

  return response;
}
