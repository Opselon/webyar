-- Seed Data for the D1 Database

-- Note: Passwords should be securely hashed in a real application.
-- This is a placeholder for a known hash (e.g., for 'password') or should be set via a secure script.
INSERT INTO users (username, password_hash, email, role) VALUES
('admin', 'placeholder_hash', 'admin@example.com', 'admin');

-- Default site settings
INSERT INTO settings (key, value) VALUES
('site_title', 'وب‌سایت خدمات سئو'),
('site_description', 'یک سایت سریع و مدرن برای ارائه خدمات سئو روی Cloudflare Workers.');

-- A sample blog post to start with
INSERT INTO posts (title, slug, content, excerpt, meta_title, meta_description, author_id, status, published_at) VALUES
(
    'به سایت جدید ما خوش آمدید',
    'welcome-to-our-new-site',
    '<p>این اولین پست وبلاگ ماست. ما در اینجا درباره آخرین تکنیک‌های سئو و بهینه‌سازی وب‌سایت صحبت خواهیم کرد.</p>',
    'اولین پست وبلاگ ما درباره شروع کار با سایت جدید سئو.',
    'به سایت جدید ما خوش آمدید | وب‌سایت خدمات سئو',
    'این اولین پست آزمایشی در وب‌سایت جدید ما است که با Cloudflare Workers ساخته شده است.',
    1, -- Corresponds to the admin user's id
    'published',
    CURRENT_TIMESTAMP
);
