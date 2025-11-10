// src/routes/dashboard.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html } from '../utils/response.mjs';
import { generateSeoMeta } from '../utils/seo.mjs';
import dashboardTemplate from '../templates/dashboard.html';

// Basic Auth Middleware
const basicAuth = (request, env) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return false;
  }

  const [scheme, encoded] = authHeader.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return false;
  }

  // These should be set in wrangler.toml as secrets
  const ADMIN_USER = env.ADMIN_USER || 'admin';
  const ADMIN_PASS = env.ADMIN_PASS || 'password';

  const [user, pass] = atob(encoded).split(':');

  return user === ADMIN_USER && pass === ADMIN_PASS;
};

export async function handleDashboard(request, env) {
  // Check for authentication
  if (!basicAuth(request, env)) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
      },
    });
  }

  const seoData = generateSeoMeta({
    title: 'داشبورد مدیریت',
    description: 'پنل مدیریت وب‌سایت',
    noIndex: true,
  });

  const renderedHtml = renderPage(dashboardTemplate, {
    seo: seoData,
  });

  return html(renderedHtml);
}
