import { describe, it, expect } from 'vitest';
import { t, getTranslations } from '../../src/utils/i18n.mjs';
import fa from '../../src/locales/fa.json';

describe('i18n utils', () => {
  it('should translate a key correctly for a given language', () => {
    const translated = t('page_titles.home', 'fa');
    expect(translated).toBe(fa.page_titles.home);
  });

  it('should fall back to the default language if a key is not found', () => {
    // Assuming 'en' has a key that 'ar' does not, and 'fa' is the default
    const key = 'a_key_that_only_exists_in_default_lang';
    const translated = t(key, 'ar');
    expect(translated).toBe(t(key, 'fa'));
  });

  it('should return the key itself if the translation is not found in any language', () => {
    const key = 'a_non_existent_key';
    const translated = t(key, 'fa');
    expect(translated).toBe(key);
  });

  it('getTranslations should return the correct translator function', () => {
    const { t: t_fa } = getTranslations('fa');
    expect(t_fa('page_titles.home')).toBe(fa.page_titles.home);
  });
});
