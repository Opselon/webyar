// src/routes/blog.mjs
import { renderPage } from '../utils/renderer.mjs';
import { html, handleNotFound } from '../utils/response.mjs';
import blogTemplate from '../templates/blog.html';
import postTemplate from '../templates/post.html';
import { generateSeoMeta } from '../utils/seo.mjs';
import { queryDb, queryDbFirst } from '../utils/db.mjs';

// Handler for the blog listing page
export async function handleBlog(request, env) {
  const query = "SELECT title, slug, excerpt, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC";
  const { results: posts } = await queryDb(env.DB, query);

  const seoData = generateSeoMeta({
    title: 'وبلاگ تخصصی سئو | مقالات و آموزش‌های جدید',
    description: 'آخرین مقالات، ترفندها و آموزش‌های سئو را در وبلاگ ما مطالعه کنید.',
    canonical: 'https://your-domain.com/blog',
  });

  const renderedHtml = renderPage(blogTemplate, {
    seo: seoData,
    contentData: { posts: posts || [] },
  });

  return html(renderedHtml);
}

// Handler for a single blog post
export async function handleBlogPost(request, env) {
  const { params } = request;
  const query = "SELECT * FROM posts WHERE slug = ? AND status = 'published'";
  const post = await queryDbFirst(env.DB, query, [params.slug]);

  if (!post) {
    return handleNotFound();
  }

  const seoData = generateSeoMeta({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    canonical: `${env.BASE_URL || 'https://your-domain.com'}/blog/${post.slug}`,
  });

  const renderedHtml = renderPage(postTemplate, {
    seo: seoData,
    contentData: { post },
  });

  return html(renderedHtml);
}
