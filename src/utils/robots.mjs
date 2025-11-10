// src/utils/robots.mjs
import { text } from './response.mjs';

export async function handleRobots(request, env) {
  const baseUrl = env.BASE_URL || "https://your-domain.com";

  const robotsContent = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`.trim();

  const response = text(robotsContent);
  // Cache robots.txt for a long time as it rarely changes
  response.headers.set('Cache-Control', 'public, max-age=604800'); // 1 week

  return response;
}
