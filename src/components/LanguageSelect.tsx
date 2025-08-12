import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconLanguage } from '@tabler/icons-react';

const languages = [
  { value: 'en', label: '🇺🇸 English' },
  { value: 'ko', label: '🇰🇷 한국어' },
  { value: 'zh', label: '🇨🇳 中文' },
  { value: 'de', label: '🇩🇪 Deutsch' },
  { value: 'nb', label: '🇳🇴 Norsk' },
  { value: 'nl', label: '🇳🇱 Nederlands' },
  { value: 'fr', label: '🇫🇷 Français' },
  { value: 'sv', label: '🇸🇪 Svenska' },
  { value: 'da', label: '🇩🇰 Dansk' },
  { value: 'es', label: '🇪🇸 Español' },
];

interface LanguageSelectProps {
  dropdownPosition?: 'top' | 'bottom' | 'bottom-end' | 'top-end';
}

export default function LanguageSelect({ dropdownPosition = 'bottom-end' }: LanguageSelectProps) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      i18n.changeLanguage(value);
      // 언어 변경 후 포커스 제거하여 스페이스바 단축키가 정상 작동하도록 함
      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      }, 100);
    }
  };

  return (
    <Select
      data={languages}
      value={i18n.language}
      onChange={handleLanguageChange}
      leftSection={<IconLanguage size={16} />}
      size="sm"
      variant="filled"
      w="100%"
      onFocus={(e) => {
        // 드롭다운이 열릴 때만 포커스 유지, 선택 후에는 즉시 제거
        setTimeout(() => e.target.blur(), 50);
      }}
      comboboxProps={{
        shadow: 'md',
        radius: 'md',
        dropdownPadding: 0,
        withinPortal: true,
        position: dropdownPosition,
        middlewares: {
          flip: dropdownPosition === 'top' ? false : true,
          shift: true,
          size: {
            apply({ availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                maxHeight: `${Math.min(availableHeight - 10, 400)}px`,
              });
            },
          },
        },
      }}
      onDropdownClose={() => {
        // 드롭다운이 닫힐 때 포커스 제거
        setTimeout(() => {
          (document.activeElement as HTMLElement)?.blur();
        }, 50);
      }}
      maxDropdownHeight={380}
      styles={{
        input: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          color: 'white',
          borderRadius: '8px',
        },
        option: {
          backgroundColor: 'transparent',
          padding: '10px 14px',
          borderRadius: '6px',
          margin: '2px 4px',
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-dark-5)',
          },
        },
        dropdown: {
          backgroundColor: 'var(--mantine-color-dark-7)',
          border: '1px solid var(--mantine-color-dark-4)',
          borderRadius: '12px',
          padding: '6px',
          backdropFilter: 'blur(8px)',
          overflowY: 'auto',
        },
      }}
    />
  );
}