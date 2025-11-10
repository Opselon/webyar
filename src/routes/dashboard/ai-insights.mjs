// src/routes/dashboard/ai-insights.mjs
import { streamHtml } from '../../utils/response.mjs';
import { generateSeoMeta } from '../../utils/seo.mjs';
import { Eta } from 'eta';

import dashboardLayoutTemplate from '../../templates/dashboard/layout.html';
import sidebarTemplate from '../../templates/dashboard/sidebar.html';
import insightsTemplate from '../../templates/dashboard/insights.html'; // Will be created

const eta = new Eta();

export async function handleDashboardInsights(request, env, ctx) {
    const user = request.user;
    const seoData = generateSeoMeta({ title: 'هوش سئو', noIndex: true });

    const sidebarHtml = eta.renderString(sidebarTemplate, { user });
    let finalLayout = dashboardLayoutTemplate.replace('{{! it.sidebar }}', sidebarHtml);
    finalLayout = finalLayout.replace('{{- it.contentTemplate }}', insightsTemplate);

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const renderedHtml = eta.renderString(finalLayout, { seo: seoData, user });
            controller.enqueue(encoder.encode(renderedHtml));
            controller.close();
        }
    });

    return streamHtml(stream);
}
