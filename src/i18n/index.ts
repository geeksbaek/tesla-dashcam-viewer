import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Language resources
import en from './locales/en.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';
import de from './locales/de.json';
import nb from './locales/nb.json';
import nl from './locales/nl.json';
import fr from './locales/fr.json';
import sv from './locales/sv.json';
import da from './locales/da.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  ko: { translation: ko },
  zh: { translation: zh },
  de: { translation: de },
  nb: { translation: nb },
  nl: { translation: nl },
  fr: { translation: fr },
  sv: { translation: sv },
  da: { translation: da },
  es: { translation: es },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;