// src/routes/dashboard-posts.mjs
import { streamHtml } from '../utils/response.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import { Eta } from 'eta';

// Import templates as text
import dashboardLayoutTemplate from '../templates/dashboard/layout.html';
import sidebarTemplate from '../templates/dashboard/sidebar.html';
import postsTemplate from '../templates/dashboard/posts.html'; // The main content for this route

const eta = new Eta();

export async function handleDashboardPosts(request, env, ctx) {
    // This route is protected by the main dashboard handler, which should verify auth.
    // We receive the user payload via request.user from the middleware.
    const user = request.user;

    const seoData = generateSeoMeta({
        title: 'مدیریت پست‌ها',
        noIndex: true,
    });

    // Inject sidebar into the main layout
    const sidebarHtml = eta.renderString(sidebarTemplate, { user });
    let finalLayout = dashboardLayoutTemplate.replace('{{! it.sidebar }}', sidebarHtml);

    // Inject the posts management UI as the main content
    finalLayout = finalLayout.replace('{{- it.contentTemplate }}', postsTemplate);

    // Stream the final composed layout
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
