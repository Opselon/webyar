import { describe, it, expect } from 'vitest';
import { analyzeSeo } from '../../src/utils/seo-audit.mjs';

describe('SEO Audit utils', () => {
  it('should return a perfect score for a well-optimized page', () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>This is a Perfect Title for SEO</title>
          <meta name="description" content="This is a perfectly crafted meta description that has an ideal length for search engines.">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="application/ld+json">{}</script>
        </head>
        <body>
          <h1>Main Heading</h1>
        </body>
      </html>
    `;
    const perfMetrics = { ttfb: 0.5, lcp: 1.5 };

    const result = analyzeSeo(htmlContent, perfMetrics);
    expect(result.score).toBe(100);
    expect(result.recommendations).toHaveLength(0);
  });

  it('should detect and penalize for a missing title', () => {
    const htmlContent = `
      <html><head></head><body><h1>Hi</h1></body></html>
    `;
    const result = analyzeSeo(htmlContent);
    expect(result.score).toBeLessThan(100);
    expect(result.recommendations).toContain('صفحه فاقد تگ <title> است.');
  });

  it('should detect multiple h1 tags', () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>This is a Perfect Title for SEO</title>
          <meta name="description" content="This is a perfectly crafted meta description that has an ideal length for search engines.">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="application/ld+json">{}</script>
        </head>
        <body>
          <h1>Main Heading</h1>
          <h1>Another Main Heading</h1>
        </body>
      </html>
    `;
    const result = analyzeSeo(htmlContent);
    expect(result.recommendations).toContain('صفحه باید دقیقاً یک تگ <h1> داشته باشد (تعداد فعلی: 2).');
  });

  it('should penalize for poor performance metrics', () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>This is a Perfect Title for SEO</title>
          <meta name="description" content="This is a perfectly crafted meta description that has an ideal length for search engines.">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="application/ld+json">{}</script>
        </head>
        <body>
          <h1>Main Heading</h1>
        </body>
      </html>
    `;
    const perfMetrics = { ttfb: 1.2, lcp: 4.5 };
    const result = analyzeSeo(htmlContent, perfMetrics);
    expect(result.score).toBeLessThan(100);
    expect(result.recommendations).toContain('TTFB برابر با 1.2s است که بالاتر از حد مطلوب (0.8s) می‌باشد.');
    expect(result.recommendations).toContain('LCP برابر با 4.5s است که بالاتر از حد مطلوب (2.5s) می‌باشد.');
  });
});
