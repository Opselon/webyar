// src/api/analytics/seo.mjs
import { json } from '../../utils/response.mjs';
import { analyzeSeo } from '../../utils/seo-audit.mjs';
import { getCachedAnalytics, setCachedAnalytics } from '../../utils/analytics-cache.mjs';

export const handleSeoAnalysis = async (request, env) => {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        return json({ error: 'The "url" query parameter is required.' }, 400);
    }

    // 1. Check for a cached result first
    const cachedResult = await getCachedAnalytics(env, targetUrl);
    if (cachedResult) {
        // Add a header to indicate cache status
        const headers = { 'X-Cache-Status': 'HIT' };
        return json(cachedResult, 200, headers);
    }

    // 2. If not cached, proceed with the analysis
    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            return json({ error: `Failed to fetch the URL. Status: ${response.status}` }, 500);
        }

        const htmlContent = await response.text();
        const analysisResult = analyzeSeo(htmlContent);

        // 3. Cache the new result before returning
        // We don't wait for this to complete, letting it run in the background.
        // In a more robust setup, you'd use ctx.waitUntil for this.
        setCachedAnalytics(env, targetUrl, analysisResult);

        const headers = { 'X-Cache-Status': 'MISS' };
        return json(analysisResult, 200, headers);

    } catch (e) {
        return json({ error: 'An error occurred while analyzing the URL.', details: e.message }, 500);
    }
};
