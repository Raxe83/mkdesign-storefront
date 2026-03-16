import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from 'i18next-browser-languagedetector';

import translationEN from './language/en.json';
import translationDE from './language/de.json';
import translationES from './language/es.json';
import translationFR from './language/fr.json';
import translationNL from './language/nl.json';

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    resources: {
      en: { translation: translationEN },
      de: { translation: translationDE },
      es: { translation: translationES },
      fr: { translation: translationFR },
      nl: { translation: translationNL } 
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
