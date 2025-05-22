import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from './locales/en/common.json'
import teTranslations from './locales/telugu/common.json'
import taTranslations from './locales/tamil/common.json'
import esTranslations from './locales/es/common.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      te: { translation: teTranslations },
      ta: { translation: taTranslations },
      es: { translation: esTranslations },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

