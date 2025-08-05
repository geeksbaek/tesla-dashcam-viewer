import { Button, Paper, Text, Title, Badge, Group, Stack, Box, ActionIcon, SegmentedControl, Tooltip } from '@mantine/core'
import { IconChevronLeft, IconChevronRight, IconVideo, IconPlayerPlay, IconPlayerPause, IconSettings, IconHome, IconPlayerTrackNext, IconBrandGithub, IconVideoFilled, IconPlayerPlayFilled, IconPlayerPauseFilled, IconSettingsFilled, IconHomeFilled } from '@tabler/icons-react'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSelect from './LanguageSelect'
import VideoFilterControls from './VideoFilterControls'
import type { VideoFilters } from './VideoFilterControls'

interface VideoFile {
  timestamp: string
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
}

interface ControlPanelProps {
  videoFiles: VideoFile[]
  currentIndex: number
  isPlaying: boolean
  onPlayPause: () => void
  onVideoSelect: (index: number) => void
  globalTime: number
  totalDuration: number
  isExpanded: boolean
  onToggleExpanded: (expanded: boolean) => void
  seekMode: 'frame' | 'time'
  onSeekModeChange: (mode: 'frame' | 'time') => void
  onGoToHome: () => void
  videoDurations: number[]
  videoFilters: VideoFilters
  onVideoFiltersChange: (filters: VideoFilters) => void
  playbackRate: number
  onPlaybackRateChange: (rate: number) => void
}

export default function ControlPanel({
  videoFiles,
  currentIndex,
  isPlaying,
  onPlayPause,
  onVideoSelect,
  globalTime,
  isExpanded,
  onToggleExpanded,
  seekMode,
  onSeekModeChange,
  onGoToHome,
  videoDurations,
  videoFilters,
  onVideoFiltersChange,
  playbackRate,
  onPlaybackRateChange
}: ControlPanelProps) {
  const { t, i18n } = useTranslation();
  const videoListRef = useRef<HTMLDivElement>(null);
  const expandedVideoListRef = useRef<HTMLDivElement>(null);
  const currentButtonRef = useRef<HTMLButtonElement>(null);
  const currentExpandedItemRef = useRef<HTMLDivElement>(null);
  
  // 현재 재생 중인 클립이 보이도록 스크롤 (축소된 사이드바)
  useEffect(() => {
    if (currentButtonRef.current && videoListRef.current) {
      const button = currentButtonRef.current;
      const container = videoListRef.current;
      const buttonTop = button.offsetTop;
      const buttonHeight = button.offsetHeight;
      const containerHeight = container.offsetHeight;
      const scrollTop = container.scrollTop;
      
      // 버튼이 보이지 않으면 스크롤
      if (buttonTop < scrollTop || buttonTop + buttonHeight > scrollTop + containerHeight) {
        container.scrollTo({
          top: buttonTop - containerHeight / 2 + buttonHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);
  
  // 현재 재생 중인 클립이 보이도록 스크롤 (확장된 사이드바)
  useEffect(() => {
    if (currentExpandedItemRef.current && expandedVideoListRef.current) {
      const item = currentExpandedItemRef.current;
      const container = expandedVideoListRef.current;
      
      // 아이템을 중앙에 위치시키기
      const itemRect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeTop = itemRect.top - containerRect.top + container.scrollTop;
      const desiredScrollTop = relativeTop - (containerRect.height / 2) + (itemRect.height / 2);
      
      container.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);
  

  // 현재 재생 중인 타임스탬프를 실시간으로 계산
  const getCurrentTimestamp = () => {
    if (!videoFiles[currentIndex]) return ''
    
    const baseTimestamp = videoFiles[currentIndex].timestamp
    // 현재 비디오까지의 누적 시간 계산
    const cumulativeTime = videoDurations.length > currentIndex 
      ? videoDurations.slice(0, currentIndex).reduce((sum, dur) => sum + dur, 0)
      : currentIndex * 60 // fallback to 60 seconds per video
    const currentVideoTime = globalTime - cumulativeTime // 현재 비디오 내에서의 시간
    
    return formatTimestamp(baseTimestamp, currentVideoTime)
  }

  // 타임스탬프 포맷팅 함수
  const formatTimestamp = (baseTimestamp: string, additionalSeconds: number = 0) => {
    try {
      // 타임스탬프 파싱: "2024-01-15_14-30-25" 형식
      const parts = baseTimestamp.split('_')
      if (parts.length !== 2) return baseTimestamp.replace(/_/g, ' ').replace(/-/g, ':')
      
      const datePart = parts[0] // "2024-01-15"
      const timePart = parts[1] // "14-30-25"
      
      const [year, month, day] = datePart.split('-').map(Number)
      const [hours, minutes, seconds] = timePart.split('-').map(Number)
      
      // 기준 시간에 추가 시간을 더함
      const totalSeconds = hours * 3600 + minutes * 60 + seconds + Math.floor(additionalSeconds)
      
      const newHours = Math.floor(totalSeconds / 3600) % 24
      const newMinutes = Math.floor((totalSeconds % 3600) / 60)
      const newSecs = totalSeconds % 60
      
      // Date 객체 생성
      const date = new Date(year, month - 1, day, newHours, newMinutes, newSecs)
      
      // Intl.DateTimeFormat을 사용한 국제화 포맷팅
      const formatter = new Intl.DateTimeFormat(i18n.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24시간 형식 사용
      })
      
      return formatter.format(date)
    } catch {
      // 파싱 실패 시 기본 포맷 반환
      return baseTimestamp.replace(/_/g, ' ').replace(/-/g, ':')
    }
  }

  // 현재 클립의 프로그레스 계산 (0-100%)
  const getCurrentClipProgress = () => {
    if (!videoFiles[currentIndex]) return 0
    
    // 현재 비디오까지의 누적 시간 계산
    const cumulativeTime = videoDurations.length > currentIndex
      ? videoDurations.slice(0, currentIndex).reduce((sum, dur) => sum + dur, 0)
      : currentIndex * 60 // fallback to 60 seconds per video
    const currentVideoTime = globalTime - cumulativeTime // 현재 비디오 내에서의 시간
    const clipDuration = (videoDurations.length > currentIndex && videoDurations[currentIndex]) 
      ? videoDurations[currentIndex] 
      : 60 // 현재 클립의 실제 길이
    
    const progress = Math.min((currentVideoTime / clipDuration) * 100, 100)
    return progress
  }

  return (
    <>
      {/* 축소된 사이드바 */}
      {!isExpanded && (
        <Paper
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            width: 'auto',
            backgroundColor: 'rgba(26, 27, 30, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 40,
            borderRadius: 0,
            transition: 'all 300ms ease',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
          }}
          shadow="xl"
        >
          {/* 헤더 */}
          <Stack gap="sm" mb="md">
            <Group justify="center" align="center">
              <ActionIcon
                onClick={() => onToggleExpanded(true)}
                size="lg"
                variant="subtle"
                onFocus={(e) => e.target.blur()}
              >
                <IconChevronLeft size={18} />
              </ActionIcon>
            </Group>
          </Stack>
          
          <Box style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1,
            overflow: 'hidden'
          }}>
            <Stack gap="md" align="center" style={{ flex: 1, overflow: 'hidden' }}>
              <Button
                onClick={onPlayPause}
                size="lg"
                variant="subtle"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  padding: 0,
                  fontSize: '16px'
                }}
                onFocus={(e) => e.target.blur()}
              >
                {isPlaying ? <IconPlayerPauseFilled size={16} /> : <IconPlayerPlayFilled size={16} />}
              </Button>
              
              {/* 클립 목록 - 스크롤 가능 */}
              <Stack ref={videoListRef} gap="xs" style={{ 
                flex: 1, 
                overflow: 'auto', 
                width: '100%',
                alignItems: 'center',
                paddingBottom: '8px'
              }}>
                {videoFiles.map((_, index) => (
                  <Button
                    ref={index === currentIndex ? currentButtonRef : null}
                    key={index}
                    size="lg"
                    variant={index === currentIndex ? "light" : "subtle"}
                    onClick={() => onVideoSelect(index)}
                    style={{
                      width: '40px',
                      height: '40px',
                      padding: 0,
                      fontSize: '12px',
                      minHeight: '40px',
                      outline: 'none',
                      border: 'none'
                    }}
                    __vars={{
                      '--button-focus-outline': 'none',
                      '--button-focus-border': 'none'
                    }}
                    onFocus={(e) => e.target.blur()}
                  >
                    {index + 1}
                  </Button>
                ))}
              </Stack>
            </Stack>
            
            {/* 첫 페이지로 이동 버튼 - 하단 고정 */}
            <Box style={{ 
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Group gap={4}>
                <Tooltip label="GitHub Repository" withArrow>
                  <ActionIcon
                    size="md"
                    variant="subtle"
                    color="gray"
                    onClick={() => window.open('https://github.com/geeksbaek/tesla-dashcam-viewer', '_blank')}
                    onFocus={(e) => e.target.blur()}
                  >
                    <IconBrandGithub size={14} />
                  </ActionIcon>
                </Tooltip>
                <Button
                  onClick={onGoToHome}
                  size="lg"
                  variant="subtle"
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: 0
                  }}
                  onFocus={(e) => e.target.blur()}
                >
                  <IconHomeFilled size={14} />
                </Button>
              </Group>
            </Box>
          </Box>
        </Paper>
      )}

      {/* 확장된 사이드바 */}
      {isExpanded && (
        <Paper
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            width: '320px',
            backgroundColor: 'rgba(26, 27, 30, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 40,
            borderRadius: 0,
            overflow: 'hidden',
            transition: 'all 300ms ease',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
          }}
          shadow="xl"
        >
      {/* 헤더 */}
      <Stack gap="sm" mb="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconVideoFilled size={16} />
            <Title order={5}>{t('app.title')}</Title>
          </Group>
          <ActionIcon
            onClick={() => onToggleExpanded(false)}
            size="lg"
            variant="subtle"
            onFocus={(e) => e.target.blur()}
          >
            <IconChevronRight size={18} />
          </ActionIcon>
        </Group>
      </Stack>

      <Box style={{ 
        flex: 1, 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <Stack gap="md" style={{ flex: 1, overflow: 'hidden' }}>
          {/* 메인 컨트롤 */}
          <Stack gap="xs">
            <Button
              onClick={onPlayPause}
              size="sm"
              variant="light"
              fullWidth
              onFocus={(e) => e.target.blur()}
            >
              {isPlaying ? 
                <Group gap="xs">
                  <IconPlayerPauseFilled size={16} />
                  <Text>{t('controlPanel.pause')} (Space)</Text>
                </Group> : 
                <Group gap="xs">
                  <IconPlayerPlayFilled size={16} />
                  <Text>{t('controlPanel.play')} (Space)</Text>
                </Group>
              }
            </Button>

            {/* 방향키 이동 모드 선택 */}
            <Stack gap="xs">
              <Group gap="xs">
                <IconSettingsFilled size={12} />
                <Text size="xs" c="dimmed">{t('controlPanel.seekMode')} ({t('controlPanel.seekModeShortcut')})</Text>
              </Group>
              <SegmentedControl
                value={seekMode}
                onChange={(value) => onSeekModeChange(value as 'frame' | 'time')}
                data={[
                  { label: t('controlPanel.frameMode'), value: 'frame' },
                  { label: t('controlPanel.timeMode'), value: 'time' }
                ]}
                size="xs"
                fullWidth
                style={{ 
                  pointerEvents: 'auto'
                }}
                onFocus={(e) => e.target.blur()}
              />
            </Stack>

            {/* 재생 속도 선택 */}
            <Stack gap="xs">
              <Group gap="xs">
                <IconPlayerTrackNext size={12} />
                <Text size="xs" c="dimmed">{t('controlPanel.playbackSpeed', '재생 속도')}</Text>
              </Group>
              <Group gap={4} grow>
                {[0.1, 0.25, 0.5, 1].map((rate) => (
                  <Button
                    key={rate}
                    size="xs"
                    variant={playbackRate === rate ? "filled" : "light"}
                    onClick={() => onPlaybackRateChange(rate)}
                    onFocus={(e) => e.target.blur()}
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    {rate}x
                  </Button>
                ))}
              </Group>
            </Stack>

          </Stack>

          {/* 클립 목록 - 스크롤 가능 */}
          <Stack gap="xs" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <IconVideoFilled size={16} />
                <Title order={6}>{t('controlPanel.videos')}</Title>
              </Group>
              <Text size="xs" c="dimmed">
                {t('time.total')} {videoFiles.length}
              </Text>
            </Group>
            <Box ref={expandedVideoListRef} style={{ flex: 1, overflowY: 'auto' }}>
              <Stack gap="xs">
                {videoFiles.map((video, index) => {
                  const isActive = index === currentIndex
                  const progress = isActive ? getCurrentClipProgress() : 0
                  
                  return (
                    <div
                      ref={isActive ? currentExpandedItemRef : null}
                      key={video.timestamp}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: 'var(--mantine-spacing-xs)',
                        borderRadius: 'var(--mantine-radius-default)',
                        backgroundColor: isActive 
                          ? 'var(--mantine-color-blue-filled)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isActive 
                          ? '1px solid var(--mantine-color-blue-6)' 
                          : '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                      onClick={() => onVideoSelect(index)}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                          e.currentTarget.style.borderColor = 'var(--mantine-color-blue-4)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      {/* 프로그레스 바 - 절대 위치로 배치 */}
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: `${progress}%`,
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            transition: 'width 100ms linear',
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                      
                      {/* 텍스트 컨테이너 - 상대 위치로 위에 표시 */}
                      <div style={{ position: 'relative' }}>
                        <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                          <Text 
                            size="xs" 
                            fw={500} 
                            truncate
                            c={isActive ? 'white' : undefined}
                          >
                            {isActive ? 
                              getCurrentTimestamp() : 
                              formatTimestamp(video.timestamp)
                            }
                          </Text>
                        </Stack>
                      </div>
                    </div>
                  )
                })}
              </Stack>
            </Box>
          </Stack>
          
          {/* 비디오 필터 컨트롤 */}
          <Box style={{ 
            paddingTop: '8px'
          }}>
            <VideoFilterControls 
              filters={videoFilters}
              onFiltersChange={onVideoFiltersChange}
            />
          </Box>
        </Stack>
        
        {/* 첫 페이지로 이동 버튼 - 하단 고정 */}
        <Box style={{ 
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <Stack gap="xs">
            <LanguageSelect />
            <Group gap="xs" grow>
              <Button
                onClick={() => window.open('https://github.com/geeksbaek/tesla-dashcam-viewer', '_blank')}
                size="sm"
                variant="subtle"
                color="gray"
                style={{ flex: 1 }}
                onFocus={(e) => e.target.blur()}
              >
                <Group gap="xs">
                  <IconBrandGithub size={16} />
                  <Text>GitHub</Text>
                </Group>
              </Button>
              <Button
                onClick={onGoToHome}
                size="sm"
                variant="subtle"
                style={{ flex: 1 }}
                onFocus={(e) => e.target.blur()}
              >
                <Group gap="xs">
                  <IconHomeFilled size={16} />
                  <Text>{t('controlPanel.home')}</Text>
                </Group>
              </Button>
            </Group>
          </Stack>
        </Box>
      </Box>
        </Paper>
      )}
    </>
  )
}