-- D1 Database Schema v2.2 for the SEO Services Website
-- Changes:
--   - posts: Renamed 'meta_desc' to 'meta_description' and added 'schema_markup'.
--   - case_studies: Simplified table to match 'generate-content.mjs'.
--   - testimonials: Simplified table to match 'generate-content.mjs'.

DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS case_studies;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS settings;

-- Table: users
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'author'
);

-- Table: posts
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    meta_description TEXT,
    schema_markup TEXT,
    author_id INTEGER,
    status TEXT NOT NULL DEFAULT 'draft',
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Table: case_studies
CREATE TABLE case_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT
);

-- Table: testimonials
CREATE TABLE testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    content TEXT NOT NULL
);

-- Table: settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
);

-- Indexes
CREATE INDEX idx_posts_slug ON posts (slug);
