# وب‌سایت خدمات سئو v2: Mobile-First, High-Performance

این یک پروژه کامل و پیشرفته برای ساخت یک وب‌سایت خدمات سئو است که به طور کامل روی زیرساخت Edge شرکت Cloudflare (با استفاده از Workers و **D1 Database**) اجرا می‌شود. این پروژه با تمرکز بر **تجربه کاربری Mobile-First**، **عملکرد فوق‌العاده (Streaming HTML)**، سئو، پایداری و معماری مدرن جاوااسکریپت (ESM) ساخته شده و **کاملاً با پلن رایگان Cloudflare سازگار است.**

## ✨ ویژگی‌های کلیدی (نسخه ۲)

-   **تجربه کاربری Mobile-First:** هدر تطبیقی، منوی همبرگری، و دکمه شناور (FAB).
-   **عملکرد فوق‌العاده:** استفاده از **Streaming HTML** برای کاهش چشمگیر TTFB و بهبود Core Web Vitals.
-   **پایگاه داده SQL:** استفاده از **Cloudflare D1** برای مدیریت محتوای ساختاریافته (پست‌ها، نمونه کارها).
-   **بخش‌های محتوایی جدید:** شامل صفحات **Case Studies**، **Tools** و **FAQ**.
-   **کشینگ هوشمند:** استفاده از KV برای کش کردن پاسخ‌های HTML در Edge.
-   **تست‌های خودکار جامع:** اسکریپت‌هایی برای تست اتصال به دیتابیس، schema، و عملیات CRUD برای تمام بخش‌ها.
-   **آماده Deploy:** پروژه کاملاً پیکربندی شده و آماده `wrangler publish` است.

## 🚀 نصب و راه‌اندازی

### ۱. پیش‌نیازها

-   [Node.js](https://nodejs.org/) (نسخه 18.x یا بالاتر) و NPM
-   نصب سراسری `wrangler` و `jq`:
    ```bash
    npm install -g wrangler
    # On macOS/Linux: brew install jq || sudo apt-get install jq
    ```
-   لاگین به حساب Cloudflare: `wrangler login`

### ۲. نصب و پیکربندی

1.  **نصب پروژه:**
    ```bash
    git clone <repository_url> && cd <repo_name> && npm install
    ```
2.  **پیکربندی `wrangler.toml`:**
    -   یک دیتابیس D1 ایجاد کنید: `wrangler d1 create seo_db_v2`
    -   یک KV Namespace برای کش ایجاد کنید: `wrangler kv:namespace create CACHE_KV`
    -   مقادیر `database_id` و `id` را در `wrangler.toml` جایگذاری کنید.
3.  **اعمال Schema به دیتابیس پروداکشن:**
    ```bash
    wrangler d1 execute seo_db_v2 --file=./db/schema.sql
    ```
4.  **تنظیم Secrets:**
    ```bash
    wrangler secret put ADMIN_USER
    wrangler secret put ADMIN_PASS
    ```

### ۳. اجرای محلی و تست

1.  **اجرای سرور توسعه:**
    ```bash
    npm start
    ```
2.  **آماده‌سازی دیتابیس محلی (در ترمینال دیگر):**
    ```bash
    npx wrangler d1 execute seo_db_v2 --local --file=./db/schema.sql
    # (Optional) npx wrangler d1 execute seo_db_v2 --local --file=./db/seed.sql
    ```
3.  **اجرای تست‌های خودکار:**
    ```bash
    bash tests/test-db-connection.sh
    bash tests/test-db-schema.sh
    bash tests/test-db-crud.sh
    bash tests/test-db-crud-casestudies.sh
    ```

### ۴. Deploy نهایی

```bash
npm run deploy
```
