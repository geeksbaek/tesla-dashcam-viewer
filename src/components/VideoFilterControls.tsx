import { Switch, Group, Text } from '@mantine/core';
import { IconScan } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface VideoFilters {
  brightness: number;
  contrast: number;
  saturate: number;
  sharpen: boolean;
  invert: boolean;
  grayscale: boolean;
}

interface VideoFilterControlsProps {
  filters: VideoFilters;
  onFiltersChange: (filters: VideoFilters) => void;
}

const defaultFilters: VideoFilters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sharpen: false,
  invert: false,
  grayscale: false,
};

const licensePlateFilters: VideoFilters = {
  brightness: 100,
  contrast: 150,
  saturate: 0,
  sharpen: true,
  invert: false,
  grayscale: true,
};

export default function VideoFilterControls({ filters, onFiltersChange }: VideoFilterControlsProps) {
  const { t } = useTranslation();
  
  const isLicensePlateMode = 
    filters.brightness === licensePlateFilters.brightness &&
    filters.contrast === licensePlateFilters.contrast &&
    filters.saturate === licensePlateFilters.saturate &&
    filters.sharpen === licensePlateFilters.sharpen &&
    filters.grayscale === licensePlateFilters.grayscale;

  const handleToggle = (checked: boolean) => {
    onFiltersChange(checked ? licensePlateFilters : defaultFilters);
  };

  return (
    <Group justify="space-between" align="center">
      <Group gap="xs" align="center">
        <IconScan size={16} />
        <Text size="sm" fw={600} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {t('filters.licensePlate', '번호판 인식 최적화')}
          <kbd style={{ 
            padding: '2px 6px', 
            borderRadius: '4px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '10px',
            fontFamily: 'monospace',
            display: 'inline-flex',
            alignItems: 'center'
          }}>F</kbd>
        </Text>
      </Group>
      <Switch
        checked={isLicensePlateMode}
        onChange={(event) => handleToggle(event.currentTarget.checked)}
        size="md"
      />
    </Group>
  );
}