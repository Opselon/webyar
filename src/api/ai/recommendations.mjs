// src/api/ai/recommendations.mjs
import { json } from '../../utils/response.mjs';
import { analyzeSeo } from '../../utils/seo-audit.mjs';

/**
 * Handles GET /api/ai/recommendations?url=<target_url>
 * This is a rule-based "AI" that provides SEO recommendations.
 * It uses the same SEO audit engine as the main analytics API.
 */
export const getAiRecommendations = async (request, env) => {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        return json({ error: 'The "url" query parameter is required.' }, 400);
    }

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            return json({ error: `Failed to fetch the URL.` }, 500);
        }

        const htmlContent = await response.text();
        const { recommendations } = analyzeSeo(htmlContent);

        return json({ recommendations });

    } catch (e) {
        return json({ error: 'An error occurred while generating recommendations.' }, 500);
    }
};
