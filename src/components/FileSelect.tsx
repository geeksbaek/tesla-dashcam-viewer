import React, { useCallback, useState } from 'react'
import { Paper, Title, Text, Button, Group, Stack, Container, Box, Badge, Divider, Center, ActionIcon, Tooltip } from '@mantine/core'
import { IconVideo, IconMovie, IconDragDrop, IconBrandTesla, IconCar, IconUpload, IconFolders, IconBrandGithub } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import LanguageSelect from './LanguageSelect'

interface VideoFile {
  timestamp: string
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
  left_pillar?: File
  right_pillar?: File
}

interface FileSelectProps {
  onFilesLoaded: (files: VideoFile[]) => void
}


export default function FileSelect({ onFilesLoaded }: FileSelectProps) {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);
  
  const parseVideoFiles = useCallback((files: FileList) => {
    const videoFiles: { [key: string]: VideoFile } = {}
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('video/')) {
        // 파일명에서 타임스탬프와 카메라 위치 추출
        const match = file.name.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})-(front|back|left_repeater|right_repeater|left_pillar|right_pillar)\.mp4/)
        
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
    setIsDragOver(false)
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
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  return (
    <Box style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--mantine-color-dark-8) 0%, var(--mantine-color-dark-7) 100%)',
      position: 'relative'
    }}>
      {/* Language selector - 우측 상단 고정 */}
      <Box style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <LanguageSelect />
      </Box>
      
      <Container size="lg" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack gap="lg" style={{ width: '100%', maxWidth: '600px' }}>
          {/* Hero Section */}
          <Stack align="center" gap="md">
            <Box style={{ 
              position: 'relative',
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(220, 38, 38, 0.3)',
              border: '3px solid rgba(255, 255, 255, 0.1)'
            }}>
              <IconBrandTesla size={48} color="white" />
            </Box>
            
            <Title order={1} ta="center" style={{ 
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('app.title')}
            </Title>
          </Stack>

          {/* Main Upload Area */}
          <Paper
            radius="xl"
            style={{
              border: isDragOver 
                ? '3px solid var(--mantine-color-red-5)' 
                : '2px dashed var(--mantine-color-dark-4)',
              cursor: 'pointer',
              transition: 'all 300ms ease',
              background: isDragOver 
                ? 'var(--mantine-color-dark-6)' 
                : 'var(--mantine-color-dark-7)',
              boxShadow: isDragOver 
                ? '0 20px 40px rgba(220, 38, 38, 0.2)' 
                : '0 10px 30px rgba(0, 0, 0, 0.3)',
              transform: isDragOver ? 'scale(1.02)' : 'scale(1)'
            }}
            p="xl"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Stack align="center" gap="lg">
              <Stack align="center" gap="xs">
                <Title order={3} ta="center" style={{ fontWeight: 600 }}>
                  {isDragOver ? t('fileSelect.dropHere') : t('fileSelect.dragDrop')}
                </Title>
                
                <Text size="sm" c="dimmed" ta="center">
                  {t('fileSelect.supportedFormats')}
                </Text>
              </Stack>
              
              <Button
                size="lg"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'red', to: 'pink' }}
                style={{ 
                  paddingLeft: '2rem', 
                  paddingRight: '2rem',
                  boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  document.getElementById('file-input')?.click()
                }}
              >
                <Group gap="sm">
                  <IconMovie size={20} />
                  <Text size="md" fw={600}>{t('fileSelect.browse')}</Text>
                </Group>
              </Button>
            </Stack>
          </Paper>

          {/* Features Section */}
          <Box style={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'visible'
          }}>
            <Group justify="center" gap="xl" wrap="nowrap" style={{ 
              minWidth: 'max-content',
              overflow: 'visible'
            }}>
              <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: '0 0 auto' }}>
                <IconVideo size={16} style={{ color: 'var(--mantine-color-blue-5)', flexShrink: 0 }} />
                <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>{t('fileSelect.features.synchronizedPlayback')}</Text>
              </Group>
              <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: '0 0 auto' }}>
                <IconMovie size={16} style={{ color: 'var(--mantine-color-green-5)', flexShrink: 0 }} />
                <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>{t('fileSelect.features.noUploadRequired')}</Text>
              </Group>
              <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: '0 0 auto' }}>
                <IconVideo size={16} style={{ color: 'var(--mantine-color-orange-5)', flexShrink: 0 }} />
                <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>{t('fileSelect.features.offlineCapable')}</Text>
              </Group>
            </Group>
          </Box>

          {/* GitHub Link */}
          <Group justify="center">
            <Button
              variant="subtle"
              color="gray"
              size="sm"
              leftSection={<IconBrandGithub size={16} />}
              onClick={() => window.open('https://github.com/geeksbaek/tesla-dashcam-viewer', '_blank')}
              style={{
                color: 'var(--mantine-color-dimmed)',
                backgroundColor: 'transparent'
              }}
            >
              {t('github.viewOnGitHub')}
            </Button>
          </Group>
          
          {/* Version Info */}
          <Text size="xs" c="dimmed" ta="center" style={{ marginTop: 'auto' }}>
            v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
          </Text>
          
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
    </Box>
  )
}