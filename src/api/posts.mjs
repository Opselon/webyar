// src/api/posts.mjs
import { json, handleNotFound } from '../utils/response.mjs';

// GET /api/posts - Get all posts
export const getPosts = async (request, env) => {
  const { keys } = await env.POSTS.list();
  const posts = await Promise.all(keys.map(key => env.POSTS.get(key.name, 'json')));
  return json(posts);
};

// GET /api/posts/:slug - Get a single post by slug
export const getPost = async (request, env) => {
  const { params } = request;
  const post = await env.POSTS.get(params.slug, 'json');
  if (!post) return handleNotFound();
  return json(post);
};

// POST /api/posts - Create a new post
export const createPost = async (request, env) => {
  const newPostData = await request.json();
  if (!newPostData.slug) {
      return json({ error: 'Slug is required' }, 400);
  }
  // Use slug as the key
  await env.POSTS.put(newPostData.slug, JSON.stringify(newPostData));
  return json(newPostData, 201);
};

// PUT /api/posts/:slug - Update a post
export const updatePost = async (request, env) => {
  const { params } = request;
  const post = await env.POSTS.get(params.slug);
  if (!post) return handleNotFound();

  const updatedData = await request.json();
  // Ensure the slug (key) doesn't change
  updatedData.slug = params.slug;

  await env.POSTS.put(params.slug, JSON.stringify(updatedData));
  return json(updatedData);
};

// DELETE /api/posts/:slug - Delete a post
export const deletePost = async (request, env) => {
    const { params } = request;
    await env.POSTS.delete(params.slug);
    return json({ message: 'Post deleted successfully' }, 200);
};
