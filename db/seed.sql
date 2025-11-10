-- Seed Data for the D1 Database (v2.1)

-- Users
INSERT INTO users (username, password_hash, email, role) VALUES
('admin', 'placeholder_hash', 'admin@example.com', 'admin');

-- Settings
INSERT INTO settings (key, value) VALUES
('site_title', 'وب‌سایت خدمات سئو'),
('site_description', 'یک سایت سریع و مدرن برای ارائه خدمات سئو روی Cloudflare Workers.');

-- Sample Post
INSERT INTO posts (title, slug, content, excerpt, meta_title, meta_desc, author_id, status, published_at) VALUES
(
    'به سایت جدید ما خوش آمدید',
    'welcome-to-our-new-site',
    '<p>این اولین پست وبلاگ ماست.</p>',
    'اولین پست وبلاگ ما.',
    'به سایت جدید ما خوش آمدید',
    'این اولین پست آزمایشی است.',
    1,
    'published',
    CURRENT_TIMESTAMP
);

-- Sample Testimonial
INSERT INTO testimonials (name, company, message, rating, is_featured) VALUES
('سارا رضایی', 'شرکت تک‌لند', 'بعد از همکاری با این تیم، ترافیک ارگانیک ما در کمتر از ۶ ماه سه برابر شد. فوق‌العاده بود!', 5, 1);
