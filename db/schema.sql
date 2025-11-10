-- D1 Database Schema for the SEO Services Website

-- Drop tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS settings;

-- Table: posts
-- Stores blog articles and other content.
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    meta_title TEXT,
    meta_description TEXT,
    author_id INTEGER,
    status TEXT NOT NULL DEFAULT 'draft', -- e.g., 'draft', 'published', 'archived'
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Table: users
-- Stores user information, primarily for authors and admins.
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Store hashed passwords, never plaintext
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'author', -- e.g., 'admin', 'author'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: settings
-- A key-value store for global site settings like site title, SEO defaults, etc.
CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
);

-- Create indexes for performance
CREATE INDEX idx_posts_slug ON posts (slug);
CREATE INDEX idx_posts_status ON posts (status);
CREATE INDEX idx_users_username ON users (username);
