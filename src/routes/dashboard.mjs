// src/routes/dashboard.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import { Eta } from 'eta';

// Import templates as text
import dashboardLayoutTemplate from '../templates/dashboard/layout.html';
import sidebarTemplate from '../templates/dashboard/sidebar.html';
import loginTemplate from '../templates/dashboard/login.html';

import { verifyJwt } from '../api/dashboard/auth.mjs';

const eta = new Eta();

export async function handleDashboard(request, env, ctx) {
    const seoData = generateSeoMeta({
        title: 'داشبورد مدیریت',
        noIndex: true,
    });

    const token = request.headers.get('Cookie')?.match(/token=([^;]+)/)?.[1];
    const user = await verifyJwt(token, env.JWT_SECRET);

    let finalLayout = dashboardLayoutTemplate;
    let contentTemplate;
    let contentData = {};

    if (user) {
        // If authenticated, inject the sidebar and set the main content
        const sidebarHtml = eta.renderString(sidebarTemplate, { user });
        finalLayout = finalLayout.replace('{{! it.sidebar }}', sidebarHtml);

        contentTemplate = `<h1>Welcome, ${user.username}!</h1>`;
        contentData = { user };

    } else {
        // If not authenticated, the sidebar is not needed
        finalLayout = finalLayout.replace('{{! it.sidebar }}', ''); // Remove sidebar placeholder
        contentTemplate = loginTemplate;
    }

    // Replace the main content placeholder with the actual content
    finalLayout = finalLayout.replace('{{- it.contentTemplate }}', contentTemplate);

    // Now, stream the combined layout.
    // We use a simple ReadableStream since the logic is already handled.
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const renderedHtml = eta.renderString(finalLayout, { seo: seoData, ...contentData });
            controller.enqueue(encoder.encode(renderedHtml));
            controller.close();
        }
    });

    return streamHtml(stream);
}
