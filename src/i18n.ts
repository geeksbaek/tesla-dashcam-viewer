import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all language files
import enTranslations from './i18n/locales/en.json';
import koTranslations from './i18n/locales/ko.json';
import zhTranslations from './i18n/locales/zh.json';
import deTranslations from './i18n/locales/de.json';
import frTranslations from './i18n/locales/fr.json';
import esTranslations from './i18n/locales/es.json';
import nlTranslations from './i18n/locales/nl.json';
import nbTranslations from './i18n/locales/nb.json';
import svTranslations from './i18n/locales/sv.json';
import daTranslations from './i18n/locales/da.json';

const resources = {
  en: { translation: enTranslations },
  ko: { translation: koTranslations },
  zh: { translation: zhTranslations },
  de: { translation: deTranslations },
  fr: { translation: frTranslations },
  es: { translation: esTranslations },
  nl: { translation: nlTranslations },
  nb: { translation: nbTranslations },
  sv: { translation: svTranslations },
  da: { translation: daTranslations }
};

// localStorage에서 저장된 언어 가져오기, 없으면 영어를 기본값으로 사용
const savedLanguage = localStorage.getItem('tesla-dashcam-viewer-language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // 저장된 언어 또는 기본값(영어) 사용
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// 언어 변경 시 localStorage에 저장하고 폰트 업데이트
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('tesla-dashcam-viewer-language', lng);
  document.documentElement.setAttribute('lang', lng);
});

// 초기 언어 설정
document.documentElement.setAttribute('lang', i18n.language);

export default i18n;