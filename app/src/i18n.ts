import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from '../public/locales/en/common.json'
import teTranslations from '../public/locales/telugu/common.json'
import taTranslations from '../public/locales/tamil/common.json'
import esTranslations from '../public/locales/es/common.json'

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

