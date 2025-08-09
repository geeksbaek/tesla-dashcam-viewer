import { Switch, Group, Text, Tooltip } from '@mantine/core';
import { IconScan } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';

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
  const textRef = useRef<HTMLDivElement>(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  
  const isLicensePlateMode = 
    filters.brightness === licensePlateFilters.brightness &&
    filters.contrast === licensePlateFilters.contrast &&
    filters.saturate === licensePlateFilters.saturate &&
    filters.sharpen === licensePlateFilters.sharpen &&
    filters.grayscale === licensePlateFilters.grayscale;

  const handleToggle = (checked: boolean) => {
    onFiltersChange(checked ? licensePlateFilters : defaultFilters);
  };

  const licensePlateText = t('filters.licensePlate', '번호판 인식 최적화');

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTextTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [licensePlateText]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      gap: '8px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        minWidth: 0,
        flex: 1
      }}>
        <IconScan size={16} style={{ flexShrink: 0 }} />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          minWidth: 0,
          flex: 1
        }}>
          <Tooltip label={licensePlateText} disabled={!isTextTruncated}>
            <Text ref={textRef} size="sm" fw={600} truncate style={{ 
              minWidth: 0
            }}>
              {licensePlateText}
            </Text>
          </Tooltip>
          <kbd style={{ 
            padding: '2px 6px', 
            borderRadius: '4px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '10px',
            fontFamily: 'monospace',
            flexShrink: 0
          }}>F</kbd>
        </div>
      </div>
      <Switch
        checked={isLicensePlateMode}
        onChange={(event) => handleToggle(event.currentTarget.checked)}
        size="md"
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}