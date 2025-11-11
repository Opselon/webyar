// src/utils/i18n.mjs
import fa from '../locales/fa.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const locales = { fa, en, ar };
const DEFAULT_LANG = 'fa';

function resolveKey(key, obj) {
  return key.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return acc[part];
    }
    return undefined;
  }, obj);
}

export function t(key, lang) {
  const targetLang = locales[lang] ? lang : DEFAULT_LANG;
  const translations = locales[targetLang];

  let translation = resolveKey(key, translations);

  if (!translation && targetLang !== DEFAULT_LANG) {
    const defaultTranslations = locales[DEFAULT_LANG];
    translation = resolveKey(key, defaultTranslations);
  }

  return translation || key;
}

export function getTranslations(lang) {
    const currentLang = locales[lang] ? lang : DEFAULT_LANG;
    return {
        lang: currentLang,
        t: (key) => t(key, currentLang)
    };
}
