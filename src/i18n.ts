import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ko: {
    translation: {
      'app.title': '테슬라 블랙박스 뷰어',
      'fileSelect.description': '시청할 테슬라 블랙박스 영상 파일을 선택하세요',
      'fileSelect.dragDrop': '영상 파일을 여기에 드래그 앤 드롭하세요',
      'fileSelect.supportedFormats': '지원 형식: MP4, MOV',
      'fileSelect.browse': '파일 찾기',
      'fileSelect.multipleFiles': '여러 파일을 선택할 수 있습니다'
    }
  },
  en: {
    translation: {
      'app.title': 'Tesla Dashcam Viewer',
      'fileSelect.description': 'Select Tesla dashcam video files to view',
      'fileSelect.dragDrop': 'Drag and drop video files here',
      'fileSelect.supportedFormats': 'Supported formats: MP4, MOV',
      'fileSelect.browse': 'Browse Files',
      'fileSelect.multipleFiles': 'You can select multiple files'
    }
  },
  ja: {
    translation: {
      'app.title': 'テスラ ドライブレコーダービューアー',
      'fileSelect.description': '視聴するテスラのドライブレコーダー映像ファイルを選択してください',
      'fileSelect.dragDrop': 'ビデオファイルをここにドラッグ＆ドロップ',
      'fileSelect.supportedFormats': '対応形式：MP4、MOV',
      'fileSelect.browse': 'ファイルを選択',
      'fileSelect.multipleFiles': '複数のファイルを選択できます'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// 언어 변경 시 폰트 업데이트를 위한 이벤트 리스너
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
});

// 초기 언어 설정
document.documentElement.setAttribute('lang', i18n.language);

export default i18n;