// src/utils/analytics-cache.mjs

const CACHE_TTL = 3600; // Cache analytics results for 1 hour

/**
 * Retrieves a cached analytics result from KV storage.
 * @param {object} env - The worker environment.
 * @param {string} url - The URL that was analyzed, used as a cache key.
 * @returns {Promise<object|null>} The cached result, or null if not found.
 */
export async function getCachedAnalytics(env, url) {
    if (!env.CACHE_KV) return null;

    const cacheKey = `analytics:${url}`;
    try {
        const cachedData = await env.CACHE_KV.get(cacheKey, 'json');
        return cachedData;
    } catch (e) {
        console.error("Failed to retrieve from KV cache:", e);
        return null;
    }
}

/**
 * Stores an analytics result in KV storage.
 * @param {object} env - The worker environment.
 * @param {string} url - The URL that was analyzed.
 * @param {object} data - The analytics data to cache.
 */
export async function setCachedAnalytics(env, url, data) {
    if (!env.CACHE_KV) return;

    const cacheKey = `analytics:${url}`;
    try {
        // Use waitUntil to avoid blocking the response
        await env.CACHE_KV.put(cacheKey, JSON.stringify(data), { expirationTtl: CACHE_TTL });
    } catch (e) {
        console.error("Failed to write to KV cache:", e);
    }
}
