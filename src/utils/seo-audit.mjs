// src/utils/seo-audit.mjs

/**
 * AI-Enhanced SEO Audit Engine (Rule-Based).
 * Analyzes HTML content and performance metrics.
 *
 * @param {string} htmlContent - The full HTML content of a page.
 * @param {object} [perfMetrics={}] - Optional performance metrics.
 * @param {number} [perfMetrics.ttfb] - Time to First Byte in seconds.
 * @param {number} [perfMetrics.lcp] - Largest Contentful Paint in seconds.
 * @returns {object} An object with score, recommendations, and analysis.
 */
export function analyzeSeo(htmlContent, perfMetrics = {}) {
    const recommendations = [];
    let score = 100;
    const MAX_POINTS_PER_CATEGORY = {
        title: 20,
        description: 20,
        headings: 15,
        performance: 25,
        structuredData: 10,
        mobile: 10,
    };

    // --- Helper function to run a check and deduct points ---
    const check = (value, points, category) => {
        if (!value) {
            score -= points;
            MAX_POINTS_PER_CATEGORY[category] -= points; // Track points lost per category
            return false;
        }
        return true;
    };

    // --- SEO Checks ---

    // 1. Title
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    if (check(title, 20, 'title')) {
        if (!check(title.length >= 30 && title.length <= 60, 10, 'title')) {
            recommendations.push("طول عنوان صفحه خارج از محدوده بهینه (30-60) است.");
        }
    } else {
        recommendations.push("صفحه فاقد تگ <title> است.");
    }

    // 2. Meta Description
    const metaDescMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1] : '';
    if (check(metaDescription, 20, 'description')) {
        if (!check(metaDescription.length >= 70 && metaDescription.length <= 160, 10, 'description')) {
            recommendations.push("طول متا توضیحات خارج از محدوده بهینه (70-160) است.");
        }
    } else {
        recommendations.push("صفحه فاقد متا تگ توضیحات است.");
    }

    // 3. Headings
    const h1Count = (htmlContent.match(/<h1.*?>/gi) || []).length;
    if (!check(h1Count === 1, 15, 'headings')) {
        recommendations.push(`صفحه باید دقیقاً یک تگ <h1> داشته باشد (تعداد فعلی: ${h1Count}).`);
    }

    // 4. Performance (from external metrics)
    const { ttfb, lcp } = perfMetrics;
    if (ttfb !== undefined) {
        if (!check(ttfb <= 0.8, 15, 'performance')) {
            recommendations.push(`TTFB برابر با ${ttfb}s است که بالاتر از حد مطلوب (0.8s) می‌باشد.`);
        }
    }
     if (lcp !== undefined) {
        if (!check(lcp <= 2.5, 10, 'performance')) {
            recommendations.push(`LCP برابر با ${lcp}s است که بالاتر از حد مطلوب (2.5s) می‌باشد.`);
        }
    }

    // 5. Structured Data (Simple Check)
    if (!check(/<script\s+type=["']application\/ld\+json["']>/i.test(htmlContent), 10, 'structuredData')) {
        recommendations.push("صفحه فاقد داده‌های ساختاریافته (JSON-LD) است.");
    }

    // 6. Mobile Readability (Simple Heuristic)
    if (!check(/<meta\s+name=["']viewport["']/.test(htmlContent), 10, 'mobile')) {
        recommendations.push("تگ viewport برای نمایش صحیح در موبایل یافت نشد.");
    }


    return {
        score: Math.max(0, score),
        recommendations,
    };
}
