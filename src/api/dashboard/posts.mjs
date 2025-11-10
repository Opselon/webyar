// src/api/posts.mjs
import { json, handleNotFound } from '../utils/response.mjs';
import { queryDb, queryDbFirst, execDb } from '../utils/db.mjs';

// GET /api/posts - Get all posts
export const getPosts = async (request, env) => {
  const { results } = await queryDb(env.DB, 'SELECT id, title, slug, excerpt, status, published_at FROM posts ORDER BY created_at DESC');
  return json(results || []);
};

// GET /api/posts/:id - Get a single post by id
export const getPost = async (request, env) => {
  const { params } = request;
  const post = await queryDbFirst(env.DB, 'SELECT * FROM posts WHERE id = ?', [params.id]);
  if (!post) return handleNotFound();
  return json(post);
};

// POST /api/posts - Create a new post
export const createPost = async (request, env) => {
  const postData = await request.json();
  if (!postData.slug || !postData.title) {
    return json({ error: 'Title and Slug are required' }, 400);
  }

  const query = 'INSERT INTO posts (title, slug, content, excerpt, meta_title, meta_description, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const { success, meta } = await execDb(env.DB, query, [
      postData.title,
      postData.slug,
      postData.content || '',
      postData.excerpt || '',
      postData.meta_title || postData.title,
      postData.meta_description || postData.excerpt || '',
      postData.status || 'draft',
    ]);

    if (success) {
      // D1 doesn't return the created object, so we might need another query to get it
      // or just return the input data for simplicity.
      const lastId = meta.last_row_id;
      const newPost = await queryDbFirst(env.DB, 'SELECT * FROM posts WHERE id = ?', [lastId]);
      return json(newPost, 201);
    } else {
        return json({ error: 'Failed to create post', details: meta }, 500);
    }
  } catch (e) {
      return json({ error: 'Database error', details: e.message }, 500);
  }
};

// PUT /api/posts/:id - Update a post
export const updatePost = async (request, env) => {
  const { params } = request;
  const postData = await request.json();

  const query = 'UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, meta_title = ?, meta_description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

  const { success, meta } = await execDb(env.DB, query, [
    postData.title,
    postData.slug,
    postData.content,
    postData.excerpt,
    postData.meta_title,
    postData.meta_description,
    postData.status,
    params.id
  ]);

  if (meta.changes > 0) {
      const updatedPost = await queryDbFirst(env.DB, 'SELECT * FROM posts WHERE id = ?', [params.id]);
      return json(updatedPost);
  }
  return handleNotFound();
};

// DELETE /api/posts/:id - Delete a post
export const deletePost = async (request, env) => {
    const { params } = request;
    const { meta } = await execDb(env.DB, 'DELETE FROM posts WHERE id = ?', [params.id]);

    if (meta.changes > 0) {
        return json({ message: 'Post deleted successfully' });
    }
    return handleNotFound();
};
