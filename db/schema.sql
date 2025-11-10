-- D1 Database Schema v2 for the SEO Services Website

-- Drop tables if they exist to ensure a clean slate
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
    meta_desc TEXT, -- Renamed from meta_description
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
    challenge TEXT, -- More descriptive than 'result'
    solution TEXT,
    results TEXT, -- A summary of outcomes
    metrics TEXT, -- JSON object for key metrics like "traffic_increase": "300%"
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
);

-- Create indexes for performance
CREATE INDEX idx_posts_slug ON posts (slug);
CREATE INDEX idx_case_studies_slug ON case_studies (slug);
