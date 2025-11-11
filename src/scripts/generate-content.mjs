import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

// --- CONFIGURATION ---
const SQL_OUTPUT_PATH = './db/seed-content.sql';
const JSON_OUTPUT_DIR = './assets/json/';
const SUPPORTED_LANGS = ['fa', 'en', 'ar'];

// --- MULTILINGUAL DATA ---

const posts = [
    {
        slug: 'technical-seo-guide', // Common slug for all languages
        fa: {
            title: 'کشف قدرت سئوی فنی: راهنمای جامع',
            content: 'سئوی فنی سنگ بنای هر استراتژی آنلاین موفق است...',
            meta_description: 'اصول سئوی فنی، از سرعت سایت تا داده‌های ساختاریافته را بیاموزید...',
        },
        en: {
            title: 'Unlocking the Power of Technical SEO: A Comprehensive Guide',
            content: 'Technical SEO is the cornerstone of any successful online strategy...',
            meta_description: 'Learn the principles of technical SEO, from site speed to structured data...',
        },
        ar: {
            title: 'إطلاق العنان لقوة تحسين محركات البحث التقني: دليل شامل',
            content: 'تحسين محركات البحث التقني هو حجر الزاوية في أي استراتيجية ناجحة عبر الإنترنت...',
            meta_description: 'تعلم مبادئ تحسين محركات البحث التقني، من سرعة الموقع إلى البيانات المنظمة...',
        }
    },
    {
        slug: 'content-strategy-guide',
        fa: {
            title: 'محتوا پادشاه است: راهنمای استراتژی محتوای سئو',
            content: 'در دنیای سئو، محتوا حرف اول را می‌زند...',
            meta_description: 'راهنمای جامع برای ساخت یک استراتژی محتوای قدرتمند سئو...',
        },
        en: {
            title: 'Content is King: A Guide to SEO Content Strategy',
            content: 'In the world of SEO, content reigns supreme...',
            meta_description: 'A comprehensive guide to building a powerful SEO content strategy...',
        },
        ar: {
            title: 'المحتوى هو الملك: دليل لاستراتيجية محتوى تحسين محركات البحث',
            content: 'في عالم تحسين محركات البحث، المحتوى هو السيد...',
            meta_description: 'دليل شامل لبناء استراتيجية محتوى قوية لتحسين محركات البحث...',
        }
    }
];

// --- FUNCTIONS ---

function sql_escape(str) {
    if (str === null || typeof str === 'undefined') return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

function generateSqlSeedFile() {
    let sql = `
-- --------------------------------------------------------------------------------
-- AUTO-GENERATED MULTILINGUAL CONTENT SEED FILE
-- Generated on: ${new Date().toISOString()}
-- --------------------------------------------------------------------------------

-- Clear existing content to make this script idempotent
DELETE FROM posts;
-- Add other tables to clear if needed (e.g., DELETE FROM testimonials;)

-- Seed Posts (Multilingual)
`;

    posts.forEach(post => {
        SUPPORTED_LANGS.forEach(lang => {
            const data = post[lang];
            if (data) {
                sql += `INSERT INTO posts (lang, slug, title, content, meta_description, created_at) VALUES (${sql_escape(lang)}, ${sql_escape(post.slug)}, ${sql_escape(data.title)}, ${sql_escape(data.content)}, ${sql_escape(data.meta_description)}, datetime('now'));\n`;
            }
        });
    });

    try {
        const dbDir = path.dirname(SQL_OUTPUT_PATH);
        if (!existsSync(dbDir)) {
            mkdirSync(dbDir, { recursive: true });
        }
        writeFileSync(SQL_OUTPUT_PATH, sql, 'utf-8');
        console.log(`✅ SQL content seed file generated at ${SQL_OUTPUT_PATH}`);
    } catch(e) {
        console.error(`❌ Error generating SQL seed file:`, e);
        process.exit(1);
    }
}

// Note: Testimonials and Case Studies are left out for simplicity,
// but would follow a similar multilingual structure.

// --- SELF-EXECUTION ---
if (process.argv.includes('--seed')) {
    console.log('🚀 Starting multilingual content generation...');
    generateSqlSeedFile();
    // generateJsonFiles(); // This would also need to be updated for multilinguality
    console.log('✨ Content generation complete.');
}
