// src/routes/dashboard/analytics.mjs
import { streamHtml } from '../../utils/response.mjs';
import { generateSeoMeta } from '../../utils/seo.mjs';
import { Eta } from 'eta';

import dashboardLayoutTemplate from '../../templates/dashboard/layout.html';
import sidebarTemplate from '../../templates/dashboard/sidebar.html';
import analyticsTemplate from '../../templates/dashboard/analytics.html'; // Main content

const eta = new Eta();

export async function handleDashboardAnalytics(request, env, ctx) {
    const user = request.user;

    const seoData = generateSeoMeta({
        title: 'تحلیل‌گر سئو',
        noIndex: true,
    });

    const sidebarHtml = eta.renderString(sidebarTemplate, { user });
    let finalLayout = dashboardLayoutTemplate.replace('{{! it.sidebar }}', sidebarHtml);
    finalLayout = finalLayout.replace('{{- it.contentTemplate }}', analyticsTemplate);

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
