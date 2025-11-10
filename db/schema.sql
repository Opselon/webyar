-- D1 Database Schema v2.1 for the SEO Services Website

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
    excerpt TEXT,
    meta_title TEXT,
    meta_desc TEXT,
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
    slug TEXT NOT NULL UNIQUE,
    client TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    metrics TEXT,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: testimonials
CREATE TABLE testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT 0
);

-- Table: settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
);

-- Indexes
CREATE INDEX idx_posts_slug ON posts (slug);
CREATE INDEX idx_case_studies_slug ON case_studies (slug);
CREATE INDEX idx_testimonials_featured ON testimonials (is_featured);
