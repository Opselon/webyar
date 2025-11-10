import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

// --- CONFIGURATION ---
const SQL_OUTPUT_PATH = './db/seed-content.sql';
const JSON_OUTPUT_DIR = './assets/json/';

// --- DATA (PERSIAN) ---

const posts = [
  {
    title: 'کشف قدرت سئوی فنی: راهنمای جامع',
    slug: 'راهنمای-جامع-سئوی-فنی',
    content: 'سئوی فنی سنگ بنای هر استراتژی آنلاین موفق است. این فرآیند شامل بهینه‌سازی زیرساخت وب‌سایت شما برای کمک به ربات‌های موتور جستجو جهت خزش و ایندکس کردن کارآمدتر سایت است. این مقاله به بررسی عمیق مفاهیم اصلی مانند سرعت سایت، داده‌های ساختاریافته و سازگاری با موبایل می‌پردازد و نکات عملی برای بهبود رتبه شما ارائه می‌دهد.',
    meta_description: 'اصول سئوی فنی، از سرعت سایت تا داده‌های ساختاریافته را بیاموزید. نکات عملی برای بهبود قابلیت خزش و ایندکس وب‌سایت خود برای کسب رتبه‌های بالاتر در نتایج جستجو را کشف کنید.',
    schema_markup: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "کشف قدرت سئوی فنی: راهنمای جامع",
      "author": { "@type": "Organization", "name": "خدمات سئوی مدرن" },
      "datePublished": new Date().toISOString()
    }),
  },
  {
    title: 'محتوا پادشاه است: راهنمای استراتژی محتوای سئو',
    slug: 'راهنمای-استراتژی-محتوای-سئو',
    content: 'در دنیای سئو، محتوا حرف اول را می‌زند. یک استراتژی محتوای خوب نه‌تنها مخاطبان هدف شما را جذب می‌کند، بلکه اعتبار شما را در حوزه‌ی تخصصی‌تان تثبیت می‌کند. این راهنما همه چیز را از تحقیق کلمات کلیدی و خوشه‌بندی موضوعی گرفته تا تولید و ترویج محتوا پوشش می‌دهد و به شما کمک می‌کند تا یک موتور محتوایی برای جذب ترافیک ارگانیک بسازید.',
    meta_description: 'راهنمای جامع برای ساخت یک استراتژی محتوای قدرتمند سئو. در مورد تحقیق کلمات کلیدی، خوشه‌های موضوعی و ترویج محتوا برای جذب ترافیک ارگانیک پایدار بیاموزید.',
    schema_markup: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "محتوا پادشاه است: راهنمای استراتژی محتوای سئو",
      "author": { "@type": "Organization", "name": "خدمات سئوی مدرن" },
      "datePublished": new Date().toISOString()
    }),
  }
];

const testimonials = [
    { customer_name: 'علی کریمی، مدیرعامل شرکت تک‌نوین', content: 'استراتژی سئوی آن‌ها ترافیک ارگانیک ما را تنها در شش ماه دو برابر کرد. نتایج خود گویای همه چیز هستند. قویاً توصیه می‌شود!' },
    { customer_name: 'سارا احمدی، بنیان‌گذار فروشگاه آنلاین', content: 'تحلیل‌های حاصل از بازرسی فنی آن‌ها بسیار ارزشمند بود. سایت ما سریع‌تر شده و رتبه‌های ما هرگز بهتر از این نبوده‌اند.' },
];

const caseStudies = [
    { title: 'شرکت تک‌نوین: رشد ارگانیک ۲۰۰٪', content: 'چگونه با بازنگری کامل سئوی داخلی و فنی شرکت تک‌نوین، به رشد ۲۰۰ درصدی ترافیک ارگانیک و افزایش ۱۵۰ درصدی رتبه کلمات کلیدی در طی شش ماه دست یافتیم.' },
    { title: 'فروشگاه آنلاین: تسلط بر یک بازار خاص', content: 'بررسی عمیق استراتژی محتوا و بک‌لینک که به فروشگاه آنلاین کمک کرد تا به نتیجه شماره یک جستجو برای کلمات کلیدی اصلی خود تبدیل شود و منجر به افزایش ۳۰۰ درصدی فروش گردد.' },
];


// --- FUNCTIONS ---

/**
 * Escapes a string for safe use in a SQL INSERT statement.
 * @param {string} str The string to escape.
 * @returns {string} The escaped string, enclosed in single quotes.
 */
function sql_escape(str) {
    if (str === null || typeof str === 'undefined') return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

/**
 * Generates the db/seed-content.sql file.
 */
function generateSqlSeedFile() {
    let sql = `
-- --------------------------------------------------------------------------------
-- AUTO-GENERATED CONTENT SEED FILE (PERSIAN)
-- Generated on: ${new Date().toISOString()}
-- --------------------------------------------------------------------------------

-- Clear existing content to make this script idempotent
DELETE FROM posts;
DELETE FROM testimonials;
DELETE FROM case_studies;

-- Seed Posts (Persian)
`;

    posts.forEach(post => {
        sql += `INSERT INTO posts (title, slug, content, meta_description, schema_markup, created_at) VALUES (${sql_escape(post.title)}, ${sql_escape(post.slug)}, ${sql_escape(post.content)}, ${sql_escape(post.meta_description)}, ${sql_escape(post.schema_markup)}, datetime('now'));\n`;
    });

    sql += '\n-- Seed Testimonials (Persian)\n';
    testimonials.forEach(t => {
        sql += `INSERT INTO testimonials (customer_name, content) VALUES (${sql_escape(t.customer_name)}, ${sql_escape(t.content)});\n`;
    });

    sql += '\n-- Seed Case Studies (Persian)\n';
    caseStudies.forEach(cs => {
        sql += `INSERT INTO case_studies (title, content) VALUES (${sql_escape(cs.title)}, ${sql_escape(cs.content)});\n`;
    });

    try {
        writeFileSync(SQL_OUTPUT_PATH, sql, 'utf-8');
        console.log(`✅ SQL content seed file generated at ${SQL_OUTPUT_PATH}`);
    } catch(e) {
        console.error(`❌ Error generating SQL seed file:`, e);
        process.exit(1);
    }
}

/**
 * Generates static JSON files for testimonials and case studies.
 */
function generateJsonFiles() {
    if (!existsSync(JSON_OUTPUT_DIR)) {
        mkdirSync(JSON_OUTPUT_DIR, { recursive: true });
    }

    try {
        writeFileSync(path.join(JSON_OUTPUT_DIR, 'testimonials.json'), JSON.stringify(testimonials, null, 2), 'utf-8');
        console.log(`✅ JSON file generated at ${path.join(JSON_OUTPUT_DIR, 'testimonials.json')}`);

        writeFileSync(path.join(JSON_OUTPUT_DIR, 'case-studies.json'), JSON.stringify(caseStudies, null, 2), 'utf-8');
        console.log(`✅ JSON file generated at ${path.join(JSON_OUTPUT_DIR, 'case-studies.json')}`);
    } catch(e) {
        console.error(`❌ Error generating JSON files:`, e);
        process.exit(1);
    }
}

// --- SELF-EXECUTION ---
if (process.argv.includes('--seed')) {
    console.log('🚀 Starting content generation (Persian)...');
    generateSqlSeedFile();
    generateJsonFiles();
    console.log('✨ Content generation complete.');
}
