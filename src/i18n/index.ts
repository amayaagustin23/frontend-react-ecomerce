import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translations.json';
import es from './locales/es/translations.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    interpolation: {
      escapeValue: true,
    },
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
  });

export default i18n;
