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

export default function LanguageSelect() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      i18n.changeLanguage(value);
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
      comboboxProps={{
        shadow: 'md',
        radius: 'md',
        dropdownPadding: 0,
        withinPortal: false,
      }}
      maxDropdownHeight={500}
      styles={{
        input: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          color: 'white',
          borderRadius: '8px',
        },
        option: {
          backgroundColor: 'transparent',
          padding: '12px 16px',
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
          padding: '8px',
          backdropFilter: 'blur(8px)',
          maxHeight: 'none !important',
          height: 'auto !important',
          overflow: 'visible !important',
        },
        viewport: {
          maxHeight: 'none !important',
          height: 'auto !important',
        },
        scrollArea: {
          height: 'auto !important',
        },
      }}
    />
  );
}