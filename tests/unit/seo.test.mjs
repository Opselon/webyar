import { describe, it, expect } from 'vitest';
import { generateSeoMeta } from '../../src/utils/seo.mjs';

describe('SEO utils', () => {
  it('should generate basic SEO meta tags correctly', () => {
    const seoData = {
      title: 'Test Title',
      description: 'Test Description',
    };
    const i18n = {
      lang: 'en',
      t: (key) => key,
    };
    const path = '/test-path';
    const env = {
      BASE_URL: 'https://example.com',
    };

    const meta = generateSeoMeta(seoData, i18n, path, env);

    expect(meta.title).toBe('Test Title');
    expect(meta.description).toBe('Test Description');
    expect(meta.canonical).toBe('https://example.com/en/test-path');
  });

  it('should handle missing title and description by falling back to i18n', () => {
    const seoData = {};
    const i18n = {
      lang: 'en',
      t: (key) => `translated_${key}`,
    };
    const path = '/';
    const env = {
      BASE_URL: 'https://example.com',
    };

    const meta = generateSeoMeta(seoData, i18n, path, env);

    expect(meta.title).toBe('translated_page_titles.home');
    expect(meta.description).toBe('translated_meta_descriptions.home');
  });

  it('should generate hreflang tags for all supported languages', () => {
    const seoData = {
        title: 'Test Title',
        description: 'Test Description',
      };
    const i18n = {
      lang: 'en',
      t: (key) => key,
    };
    const path = '/';
    const env = {
      BASE_URL: 'https.example.com',
    };

    const meta = generateSeoMeta(seoData, i18n, path, env);

    expect(meta.hreflangTags).toContain('hreflang="fa"');
    expect(meta.hreflangTags).toContain('hreflang="en"');
    expect(meta.hreflangTags).toContain('hreflang="ar"');
    expect(meta.hreflangTags).toContain('hreflang="x-default"');
  });
});
