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

    const cachedResult = await getCachedAnalytics(env, targetUrl);
    if (cachedResult) {
        return json(cachedResult, 200, { 'X-Cache-Status': 'HIT' });
    }

    try {
        const startTime = Date.now();
        const response = await fetch(targetUrl);
        const ttfb = (Date.now() - startTime) / 1000; // Simplified TTFB in seconds

        if (!response.ok) {
            return json({ error: `Failed to fetch URL. Status: ${response.status}` }, 500);
        }

        const htmlContent = await response.text();

        // Pass performance metrics to the analyzer
        const analysisResult = analyzeSeo(htmlContent, { ttfb });

        // Cache the new result
        setCachedAnalytics(env, targetUrl, analysisResult);

        return json(analysisResult, 200, { 'X-Cache-Status': 'MISS' });

    } catch (e) {
        return json({ error: 'An error occurred during analysis.', details: e.message }, 500);
    }
};
