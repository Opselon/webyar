// src/utils/seo-audit.mjs

/**
 * A simple, lightweight SEO audit engine that runs on Cloudflare Workers.
 * It analyzes an HTML string using regex to avoid heavy parsing libraries.
 *
 * @param {string} htmlContent - The full HTML content of a page.
 * @returns {object} An object containing the SEO score and recommendations.
 */
export function analyzeSeo(htmlContent) {
    const recommendations = [];
    let score = 100;

    // --- Helper function to run a check ---
    const check = (description, testFn) => {
        if (!testFn()) {
            recommendations.push(description);
            score -= description.points; // Subtract points for each failure
        }
    };

    // --- SEO Checks ---

    // 1. Title Tag
    check({
        name: 'Title Tag Presence',
        message: 'صفحه فاقد تگ <title> است که برای سئو حیاتی است.',
        points: 15
    }, () => /<title>.*<\/title>/i.test(htmlContent));

    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';

    check({
        name: 'Title Tag Length',
        message: `طول عنوان صفحه (${title.length} کاراکتر) خارج از محدوده بهینه (30-60) است.`,
        points: 5
    }, () => title.length >= 30 && title.length <= 60);

    // 2. Meta Description
    const metaDescMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1] : '';

    check({
        name: 'Meta Description Presence',
        message: 'صفحه فاقد متا تگ توضیحات (meta description) است.',
        points: 10
    }, () => !!metaDescription);

    check({
        name: 'Meta Description Length',
        message: `طول متا توضیحات (${metaDescription.length} کاراکتر) خارج از محدوده بهینه (70-160) است.`,
        points: 5
    }, () => metaDescription.length >= 70 && metaDescription.length <= 160);

    // 3. H1 Heading
    check({
        name: 'H1 Heading Presence',
        message: 'هر صفحه باید دقیقاً یک تگ <h1> داشته باشد.',
        points: 10
    }, () => {
        const h1Matches = htmlContent.match(/<h1.*?>/gi);
        return h1Matches && h1Matches.length === 1;
    });

    // 4. Canonical Link
    check({
        name: 'Canonical Link Presence',
        message: 'توصیه می‌شود از تگ <link rel="canonical"> برای جلوگیری از محتوای تکراری استفاده شود.',
        points: 5
    }, () => /<link\s+rel=["']canonical["']/.test(htmlContent));

    // 5. Image Alt Tags (a simple check for missing alt attributes)
    const imgWithoutAlt = htmlContent.match(/<img(?!.*\balt=)/gi);
    check({
        name: 'Image Alt Attributes',
        message: `تعداد ${imgWithoutAlt ? imgWithoutAlt.length : 0} تصویر بدون ویژگی alt یافت شد. alt برای دسترسی‌پذیری و سئوی تصاویر مهم است.`,
        points: 5
    }, () => !imgWithoutAlt);


    return {
        score: Math.max(0, score), // Score cannot be negative
        recommendations,
        analysis: {
            title,
            metaDescription,
            h1Count: (htmlContent.match(/<h1.*?>/gi) || []).length,
        }
    };
}
