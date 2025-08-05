import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      'app.title': '테슬라 블랙박스 뷰어',
      'fileSelect.description': '시청할 테슬라 블랙박스 영상 파일을 선택하세요',
      'fileSelect.dragDrop': '영상 파일을 여기에 드래그 앤 드롭하세요',
      'fileSelect.supportedFormats': '지원 형식: MP4, MOV',
      'fileSelect.browse': '파일 찾기',
      'fileSelect.multipleFiles': '여러 파일을 선택할 수 있습니다',
      'controlPanel.play': '재생',
      'controlPanel.pause': '일시정지',
      'controlPanel.seekMode': '탐색 모드',
      'controlPanel.frameMode': '프레임',
      'controlPanel.timeMode': '시간',
      'controlPanel.playbackSpeed': '재생 속도',
      'controlPanel.videos': '영상 클립',
      'controlPanel.home': '홈으로',
      'videoGrid.front': '전방',
      'videoGrid.back': '후방',
      'videoGrid.leftRepeater': '좌측',
      'videoGrid.rightRepeater': '우측',
      'videoGrid.noVideo': '비디오 없음',
      'shortcuts.space': '스페이스바: 재생/일시정지',
      'shortcuts.leftArrow': '←→: 프레임 이동',
      'shortcuts.rightArrow': '←→: 시간 이동',
      'time.total': '총',
      'filters.licensePlate': '번호판 인식 최적화',
      'fileSelect.loadTestData': '테스트 데이터 로드 (개발용)',
      'videoGrid.loading': '비디오를 로드하는 중...',
      'videoGrid.demoMode': '(데모 모드)',
      'videoGrid.fullscreenDemo': '전체화면 기능 (데모)'
    }
  },
  en: {
    translation: {
      'app.title': 'Tesla Dashcam Viewer',
      'fileSelect.description': 'Select Tesla dashcam video files to view',
      'fileSelect.dragDrop': 'Drag and drop video files here',
      'fileSelect.supportedFormats': 'Supported formats: MP4, MOV',
      'fileSelect.browse': 'Browse Files',
      'fileSelect.multipleFiles': 'You can select multiple files',
      'controlPanel.play': 'Play',
      'controlPanel.pause': 'Pause',
      'controlPanel.seekMode': 'Seek Mode',
      'controlPanel.frameMode': 'Frame',
      'controlPanel.timeMode': 'Time',
      'controlPanel.playbackSpeed': 'Playback Speed',
      'controlPanel.videos': 'Video Clips',
      'controlPanel.home': 'Go Home',
      'videoGrid.front': 'Front',
      'videoGrid.back': 'Back',
      'videoGrid.leftRepeater': 'Left',
      'videoGrid.rightRepeater': 'Right',
      'videoGrid.noVideo': 'No Video',
      'shortcuts.space': 'Space: Play/Pause',
      'shortcuts.leftArrow': '←→: Frame Step',
      'shortcuts.rightArrow': '←→: Time Seek',
      'time.total': 'Total',
      'filters.licensePlate': 'License Plate Recognition',
      'fileSelect.loadTestData': 'Load Test Data (Dev)',
      'videoGrid.loading': 'Loading video...',
      'videoGrid.demoMode': '(Demo Mode)',
      'videoGrid.fullscreenDemo': 'Fullscreen Feature (Demo)'
    }
  },
  ja: {
    translation: {
      'app.title': 'テスラ ドライブレコーダービューアー',
      'fileSelect.description': '視聴するテスラのドライブレコーダー映像ファイルを選択してください',
      'fileSelect.dragDrop': 'ビデオファイルをここにドラッグ＆ドロップ',
      'fileSelect.supportedFormats': '対応形式：MP4、MOV',
      'fileSelect.browse': 'ファイルを選択',
      'fileSelect.multipleFiles': '複数のファイルを選択できます',
      'controlPanel.play': '再生',
      'controlPanel.pause': '一時停止',
      'controlPanel.seekMode': 'シークモード',
      'controlPanel.frameMode': 'フレーム',
      'controlPanel.timeMode': '時間',
      'controlPanel.playbackSpeed': '再生速度',
      'controlPanel.videos': 'ビデオクリップ',
      'controlPanel.home': 'ホームへ',
      'videoGrid.front': '前方',
      'videoGrid.back': '後方',
      'videoGrid.leftRepeater': '左側',
      'videoGrid.rightRepeater': '右側',
      'videoGrid.noVideo': 'ビデオなし',
      'shortcuts.space': 'スペース: 再生/一時停止',
      'shortcuts.leftArrow': '←→: フレーム移動',
      'shortcuts.rightArrow': '←→: 時間移動',
      'time.total': '合計',
      'filters.licensePlate': 'ナンバープレート認識最適化',
      'fileSelect.loadTestData': 'テストデータロード（開発用）',
      'videoGrid.loading': 'ビデオを読み込み中...',
      'videoGrid.demoMode': '（デモモード）',
      'videoGrid.fullscreenDemo': 'フルスクリーン機能（デモ）'
    }
  }
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