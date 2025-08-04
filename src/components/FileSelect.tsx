import React, { useCallback } from 'react'
import { Paper, Title, Text, Button, Group, Stack, Container, Box } from '@mantine/core'
import { IconVideo, IconMovie, IconDragDrop } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import LanguageSelect from './LanguageSelect'

interface VideoFile {
  timestamp: string
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
}

interface FileSelectProps {
  onFilesLoaded: (files: VideoFile[]) => void
  onLoadDummy?: () => void
}


export default function FileSelect({ onFilesLoaded, onLoadDummy }: FileSelectProps) {
  const { t } = useTranslation();
  const parseVideoFiles = useCallback((files: FileList) => {
    const videoFiles: { [key: string]: VideoFile } = {}
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('video/')) {
        // 파일명에서 타임스탬프와 카메라 위치 추출
        const match = file.name.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})-(front|back|left_repeater|right_repeater)\.mp4/)
        
        if (match) {
          const [, timestamp, position] = match
          
          if (!videoFiles[timestamp]) {
            videoFiles[timestamp] = { timestamp }
          }
          
          videoFiles[timestamp][position as keyof Omit<VideoFile, 'timestamp'>] = file
        }
      }
    })
    
    // 타임스탬프 순으로 정렬
    const sortedFiles = Object.values(videoFiles).sort((a, b) => 
      a.timestamp.localeCompare(b.timestamp)
    )
    
    onFilesLoaded(sortedFiles)
  }, [onFilesLoaded])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      parseVideoFiles(files)
    }
  }, [parseVideoFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      parseVideoFiles(files)
    }
  }, [parseVideoFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return (
    <Container size="md" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Language selector - 우측 상단 고정 */}
      <Box style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <LanguageSelect />
      </Box>
      
      <Stack gap="xl" style={{ width: '100%' }}>
        {/* 메인 파일 선택 카드 */}
        <Paper
          style={{
            border: '2px dashed var(--mantine-color-dark-4)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            '--paper-hover-border-color': 'var(--mantine-color-blue-4)',
            '--paper-hover-background-color': 'var(--mantine-color-dark-6)'
          } as any}
          p="xl"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Stack align="center" gap="lg">
            <Box style={{ 
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--mantine-color-blue-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconVideo size={32} />
            </Box>
            
            <Title order={2} ta="center" className="font-apple">{t('app.title')}</Title>
            <Text ta="center" size="lg" c="dimmed" className="font-apple">
              {t('fileSelect.description')}
            </Text>
            
            <Stack gap="xs" align="center">
              <Text size="sm" c="dimmed">
                {t('fileSelect.dragDrop')}
              </Text>
              <Text size="xs" c="dimmed">
                {t('fileSelect.supportedFormats')}
              </Text>
            </Stack>
            
            {/* 파일 선택 버튼 */}
            <Button
              size="md"
              variant="light"
              onClick={(e) => {
                e.stopPropagation()
                document.getElementById('file-input')?.click()
              }}
            >
              <Group gap="xs">
                <IconMovie size={16} />
                <Text>{t('fileSelect.browse')}</Text>
              </Group>
            </Button>
            
            {/* 드래그 앤 드롭 힌트 */}
            <Group gap="xs">
              <IconDragDrop size={16} />
              <Text size="sm" c="dimmed">{t('fileSelect.multipleFiles')}</Text>
            </Group>
          </Stack>
        </Paper>
        
        {/* 숨겨진 파일 입력 요소 */}
        <input
          id="file-input"
          type="file"
          multiple
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </Stack>
    </Container>
  )
}