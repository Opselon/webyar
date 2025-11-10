// src/routes/blog.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html, handleNotFound } from '../utils/response.mjs';
import blogTemplate from '../templates/blog.html';
import postTemplate from '../templates/post.html';
import { generateSeoMeta } from '../utils/seo.mjs';

// Handler for the blog listing page
export async function handleBlog(request, env) {
  const { keys } = await env.POSTS.list();
  const posts = await Promise.all(keys.map(key => env.POSTS.get(key.name, 'json')));

  // Sort posts by date, assuming date is a property in the stored JSON
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const seoData = generateSeoMeta({
    title: 'وبلاگ تخصصی سئو | مقالات و آموزش‌های جدید',
    description: 'آخرین مقالات، ترفندها و آموزش‌های سئو را در وبلاگ ما مطالعه کنید.',
    canonical: 'https://your-domain.com/blog',
  });

  const renderedHtml = renderPage(blogTemplate, {
    seo: seoData,
    contentData: { posts },
  });

  return html(renderedHtml);
}

// Handler for a single blog post
export async function handleBlogPost(request, env) {
  const { params } = request;
  const post = await env.POSTS.get(params.slug, 'json');

  if (!post) {
    return handleNotFound();
  }

  const seoData = generateSeoMeta({
    title: post.title,
    description: post.excerpt,
    canonical: `https://your-domain.com/blog/${post.slug}`,
  });

  const renderedHtml = renderPage(postTemplate, {
    seo: seoData,
    contentData: { post },
  });

  return html(renderedHtml);
}
