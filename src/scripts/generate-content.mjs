import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const SQL_OUTPUT_PATH = './db/seed-content.sql';
const SUPPORTED_LANGS = ['fa', 'en', 'ar'];

const posts = [
    {
        slug: 'technical-seo-guide',
        fa: { title: 'کشف قدرت سئوی فنی: راهنمای جامع', content: '...', meta_description: '...' },
        en: { title: 'Unlocking the Power of Technical SEO: A Comprehensive Guide', content: '...', meta_description: '...' },
        ar: { title: 'إطلاق العنان لقوة تحسين محركات البحث التقني: دليل شامل', content: '...', meta_description: '...' }
    },
    {
        slug: 'content-strategy-guide',
        fa: { title: 'محتوا پادشاه است: راهنمay استراتژی محتوای سئو', content: '...', meta_description: '...' },
        en: { title: 'Content is King: A Guide to SEO Content Strategy', content: '...', meta_description: '...' },
        ar: { title: 'المحتوى هو الملك: دليل لاستراتيجية محتوى تحسين محركات البحث', content: '...', meta_description: '...' }
    }
];

function sql_escape(str) {
    if (str === null || typeof str === 'undefined') return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

function generateSqlSeedFile() {
    let sql = `-- AUTO-GENERATED MULTILINGUAL CONTENT SEED FILE\n\nDELETE FROM posts;\n\n`;

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

if (process.argv.includes('--seed')) {
    generateSqlSeedFile();
}
