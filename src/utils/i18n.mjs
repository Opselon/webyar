// src/utils/i18n.mjs

// Import locale data statically.
// In a real-world Cloudflare Worker, you might use KV storage for this,
// but static imports are fine for this project's scale.
import fa from '../locales/fa.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const locales = { fa, en, ar };
const DEFAULT_LANG = 'fa';

/**
 * Resolves a nested key from an object.
 * e.g., "page_titles.home" -> obj['page_titles']['home']
 * @param {string} key - The key to resolve (e.g., "a.b.c").
 * @param {object} obj - The object to search within.
 * @returns {string|null} - The resolved value or null if not found.
 */
function resolveKey(key, obj) {
  return key.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return acc[part];
    }
    return undefined;
  }, obj);
}

/**
 * Translates a key for a given language.
 *
 * @param {string} key - The translation key (e.g., "page_titles.home").
 * @param {string} lang - The desired language ('fa', 'en', 'ar').
 * @returns {string} - The translated string or the key itself if not found.
 */
export function t(key, lang) {
  const targetLang = locales[lang] ? lang : DEFAULT_LANG;
  const translations = locales[targetLang];

  let translation = resolveKey(key, translations);

  // If translation is not found in the target language, try the default language.
  if (!translation && targetLang !== DEFAULT_LANG) {
    const defaultTranslations = locales[DEFAULT_LANG];
    translation = resolveKey(key, defaultTranslations);
  }

  return translation || key; // Return the key as a last resort
}

/**
 * Gets the locale information for a request.
 * For now, it just returns the language and the translator function.
 *
 * @param {string} lang - The language code from the URL.
 * @returns {object} - An object containing the lang and the t function.
 */
export function getTranslations(lang) {
    const currentLang = locales[lang] ? lang : DEFAULT_LANG;
    return {
        lang: currentLang,
        t: (key) => t(key, currentLang)
    };
}
