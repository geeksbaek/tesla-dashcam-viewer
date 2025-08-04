import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Paper, Button, Group, Stack, Box, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { VideoFilters } from './VideoFilterControls'

interface VideoFile {
  timestamp: string
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
}

interface VideoGridProps {
  videoFile: VideoFile
  videoFiles: VideoFile[]
  currentVideoIndex: number
  isPlaying: boolean
  currentTime: number
  globalTime: number
  duration: number
  playbackRate: number
  seekMode: 'frame' | 'time'
  videoFilters: VideoFilters
  onTimeUpdate: (time: number) => void
  onSeek: (time: number) => void
  onPlayPause: () => void
  onVideoSelect: (index: number) => void
  onPlaybackRateChange: (rate: number) => void
  onSeekModeChange: (mode: 'frame' | 'time') => void
  onFrameRateUpdate: (frameRate: number) => void
  onVideoDurationUpdate: (duration: number) => void
  sidebarExpanded?: boolean
}

export default function VideoGrid({ 
  videoFile, 
  videoFiles, 
  currentVideoIndex, 
  isPlaying, 
  currentTime, 
  globalTime, 
  duration, 
  playbackRate,
  seekMode,
  videoFilters,
  onTimeUpdate, 
  onSeek,
  onPlayPause,
  onVideoSelect,
  onPlaybackRateChange,
  onSeekModeChange,
  onFrameRateUpdate,
  onVideoDurationUpdate,
  sidebarExpanded = true
}: VideoGridProps) {
  const { t } = useTranslation();
  const frontRef = useRef<HTMLVideoElement>(null)
  const backRef = useRef<HTMLVideoElement>(null)
  const leftRef = useRef<HTMLVideoElement>(null)
  const rightRef = useRef<HTMLVideoElement>(null)

  const videoRefs = [frontRef, backRef, leftRef, rightRef]
  
  // 전체화면 모드 상태
  const [fullscreenCamera, setFullscreenCamera] = useState<string | null>(null)
  const [hoveredCamera, setHoveredCamera] = useState<string | null>(null)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)
  
  // CSS 필터 문자열 생성
  const filterString = useMemo(() => {
    const filters: string[] = []
    
    if (videoFilters.brightness !== 100) {
      filters.push(`brightness(${videoFilters.brightness}%)`)
    }
    if (videoFilters.contrast !== 100) {
      filters.push(`contrast(${videoFilters.contrast}%)`)
    }
    if (videoFilters.saturate !== 100) {
      filters.push(`saturate(${videoFilters.saturate}%)`)
    }
    if (videoFilters.grayscale) {
      filters.push('grayscale(100%)')
    }
    if (videoFilters.invert) {
      filters.push('invert(100%)')
    }
    
    // 샤프닝 효과를 위한 추가 필터들
    if (videoFilters.sharpen) {
      // 검은색 텍스트를 강조하기 위한 그림자
      filters.push('drop-shadow(0 0 0.5px rgba(0,0,0,1))')
      filters.push('drop-shadow(0 0 0.5px rgba(0,0,0,1))')
      // 추가 대비 향상으로 샤프닝 효과 증대
      filters.push('contrast(110%)')
    }
    
    return filters.length > 0 ? filters.join(' ') : 'none'
  }, [videoFilters])
  
  // 재생 상태 변화 추적을 위한 ref
  const lastPlayStateRef = useRef(isPlaying)
  const playStateChangeTimeRef = useRef(Date.now())
  const stateChangeCountRef = useRef(0)
  const suppressSyncRef = useRef(false)
  const lastTimeUpdateRef = useRef(0)
  const pauseTimeRef = useRef(0)
  
  // URL 객체들을 상태로 관리
  const [videoUrls, setVideoUrls] = useState<{
    front?: string
    back?: string  
    left_repeater?: string
    right_repeater?: string
  }>({})

  // 비디오 파일이 변경될 때 URL 생성 및 정리
  useEffect(() => {
    const newUrls: typeof videoUrls = {}
    
    if (videoFile?.front) {
      newUrls.front = URL.createObjectURL(videoFile.front)
    }
    if (videoFile?.back) {
      newUrls.back = URL.createObjectURL(videoFile.back)
    }
    if (videoFile?.left_repeater) {
      newUrls.left_repeater = URL.createObjectURL(videoFile.left_repeater)
    }
    if (videoFile?.right_repeater) {
      newUrls.right_repeater = URL.createObjectURL(videoFile.right_repeater)
    }
    
    setVideoUrls(newUrls)
    
    return () => {
      Object.values(newUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [videoFile])

  // 비디오 초기화 및 실제 프레임레이트 감지
  useEffect(() => {
    if (!videoFile) return
    
    const timer = setTimeout(() => {
      const videos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
      
      videos.forEach(video => {
        if (video.readyState >= 2) {
          video.currentTime = currentTime
          if (isPlaying && video.paused) {
            video.play().catch(err => console.log('Play failed:', err))
          }
        }
      })
      
      onFrameRateUpdate(30) // 기본값 사용
    }, 200)
    
    return () => clearTimeout(timer)
  }, [videoFile])

  // 비디오 종료 이벤트 처리
  useEffect(() => {
    const videos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
    if (videos.length === 0) return

    const handleVideoEnded = () => {
      // 마지막 비디오가 아닌 경우 다음 비디오로 이동
      if (currentVideoIndex < videoFiles.length - 1) {
        // 다음 비디오로 이동하고 재생 상태 유지
        const nextIndex = currentVideoIndex + 1
        onVideoSelect(nextIndex)
        
        // 약간의 지연 후 재생을 시작하여 비디오가 로드될 시간을 줌
        setTimeout(() => {
          const nextVideos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
          nextVideos.forEach(video => {
            if (video.readyState >= 2) {
              video.play().catch(err => console.log('Auto-play failed:', err))
            }
          })
        }, 100)
      } else {
        // 마지막 비디오인 경우 재생 정지
        onPlayPause()
      }
    }

    // 첫 번째 비디오의 ended 이벤트만 감지 (모든 비디오는 동시에 끝남)
    const masterVideo = videos[0]
    if (masterVideo) {
      masterVideo.addEventListener('ended', handleVideoEnded)
    }

    return () => {
      if (masterVideo) {
        masterVideo.removeEventListener('ended', handleVideoEnded)
      }
    }
  }, [currentVideoIndex, videoFiles.length, onVideoSelect, onPlayPause])

  useEffect(() => {
    const videos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
    
    if (isPlaying) {
      videos.forEach(video => {
        if (video.paused && video.readyState >= 2) {
          video.play().catch(err => console.log('Play failed:', err))
        }
      })
    } else {
      videos.forEach(video => {
        if (!video.paused) {
          video.pause()
        }
      })
    }
  }, [isPlaying])

  // 최소한의 비디오 시간 업데이트
  useEffect(() => {
    const videos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
    if (videos.length === 0) return

    const masterVideo = videos[0]
    
    const handleTimeUpdate = () => {
      if (suppressSyncRef.current || stateChangeCountRef.current >= 3) {
        return
      }
      
      if (!masterVideo.paused) {
        const newTime = masterVideo.currentTime
        const recentStateChange = Date.now() - playStateChangeTimeRef.current < 200
        if (recentStateChange) {
          return
        }
        
        if (newTime >= lastTimeUpdateRef.current) {
          lastTimeUpdateRef.current = newTime
          onTimeUpdate(newTime)
        }
      }
    }

    masterVideo.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      masterVideo.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [videoFile, onTimeUpdate])

  // 재생 상태 변화 추적
  useEffect(() => {
    if (lastPlayStateRef.current !== isPlaying) {
      const videos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
      
      if (videos.length > 0) {
        const masterVideo = videos[0]
        
        if (!isPlaying) {
          const currentTime = masterVideo.currentTime
          pauseTimeRef.current = currentTime
          lastTimeUpdateRef.current = currentTime
          onTimeUpdate(currentTime)
        }
      }
      
      lastPlayStateRef.current = isPlaying
      playStateChangeTimeRef.current = Date.now()
      stateChangeCountRef.current++
      
      if (stateChangeCountRef.current > 3) {
        suppressSyncRef.current = true
        setTimeout(() => {
          suppressSyncRef.current = false
          stateChangeCountRef.current = 0
        }, 1000)
      } else {
        setTimeout(() => {
          stateChangeCountRef.current = 0
        }, 1500)
      }
    }
  }, [isPlaying, onTimeUpdate])

  // 외부 시간 동기화
  useEffect(() => {
    const videos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
    
    if (videos.length === 0 || suppressSyncRef.current) return
    
    const timeSincePlayStateChange = Date.now() - playStateChangeTimeRef.current
    const isRecentStateChange = timeSincePlayStateChange < 200
    const hasFrequentStateChanges = stateChangeCountRef.current >= 3
    
    videos.forEach((video, index) => {
      if (video.readyState >= 1) {
        const timeDiff = Math.abs(video.currentTime - currentTime)
        let threshold = isPlaying ? 0.5 : 0.1
        
        if (isRecentStateChange) {
          threshold = isPlaying ? 1.5 : 0.3
        }
        
        if (hasFrequentStateChanges && isRecentStateChange) {
          return
        }
        
        if (timeDiff > threshold) {
          video.currentTime = currentTime
          
          if (index === 0) {
            lastTimeUpdateRef.current = currentTime
          }
        }
      }
    })
  }, [currentTime, isPlaying])

  // 재생 속도 동기화
  useEffect(() => {
    const videos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
    videos.forEach(video => {
      video.playbackRate = playbackRate
    })
  }, [playbackRate])

  // 전체화면 변화 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenCamera(null)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 프레임 단위 이동 이벤트 핸들러
  useEffect(() => {
    const handleFrameSeek = (event: CustomEvent) => {
      const { direction, frameRate } = event.detail
      const videos = videoRefs.map(ref => ref.current).filter(Boolean) as HTMLVideoElement[]
      
      if (videos.length === 0) return
      
      const masterVideo = videos[0]
      const currentTime = masterVideo.currentTime
      const frameStep = 1 / frameRate
      
      const newTime = direction > 0 
        ? Math.min(60, currentTime + frameStep)
        : Math.max(0, currentTime - frameStep)
      
      videos.forEach(video => {
        if (video.readyState >= 1) {
          video.currentTime = newTime
        }
      })
      
      lastTimeUpdateRef.current = newTime
      onTimeUpdate(newTime)
    }

    window.addEventListener('frameSeek', handleFrameSeek as EventListener)
    return () => window.removeEventListener('frameSeek', handleFrameSeek as EventListener)
  }, [onTimeUpdate])

  // 전체화면 토글 이벤트 핸들러
  useEffect(() => {
    const handleToggleFullscreen = (event: CustomEvent) => {
      const { camera } = event.detail
      toggleFullscreen(camera)
    }

    window.addEventListener('toggleFullscreen', handleToggleFullscreen as EventListener)
    return () => window.removeEventListener('toggleFullscreen', handleToggleFullscreen as EventListener)
  }, [])

  // 브라우저 전체화면 진입
  const enterFullscreen = async (camera: string) => {
    setFullscreenCamera(camera)
    
    setTimeout(async () => {
      if (fullscreenContainerRef.current) {
        try {
          await fullscreenContainerRef.current.requestFullscreen()
        } catch (error) {
          console.log('전체화면 진입 실패:', error)
        }
      }
    }, 100)
  }

  // 브라우저 전체화면 종료
  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
      setFullscreenCamera(null)
    } catch (error) {
      console.log('전체화면 종료 실패:', error)
      setFullscreenCamera(null)
    }
  }

  // 카메라 전체화면 토글 함수
  const toggleFullscreen = (camera: string) => {
    if (fullscreenCamera === camera) {
      exitFullscreen()
    } else {
      enterFullscreen(camera)
    }
  }

  if (!videoFile) {
    return (
      <Box style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        비디오를 로드하는 중...
      </Box>
    )
  }

  return (
    <Box style={{ 
      height: '100vh', 
      width: sidebarExpanded ? 'calc(100vw - 320px)' : 'calc(100vw - 60px)', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden', 
      backgroundColor: 'black', 
      position: 'relative',
      transition: 'width 300ms ease'
    }}>
      {/* 전체화면 모드 */}
      {fullscreenCamera && (
        <Box 
          ref={fullscreenContainerRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={exitFullscreen}
        >
          {fullscreenCamera === 'front' && (
            videoUrls.front ? (
              <video
                src={videoUrls.front}
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: filterString }}
                controls={false}
                muted
                preload="auto"
                playsInline
                disablePictureInPicture
                ref={(video) => {
                  if (video && frontRef.current) {
                    video.currentTime = frontRef.current.currentTime
                    if (isPlaying) video.play()
                    else video.pause()
                  }
                }}
              />
            ) : (
              <Box style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
{t('videoGrid.front')} (데모 모드)
              </Box>
            )
          )}
          
          {fullscreenCamera === 'back' && (
            videoUrls.back ? (
              <video
                src={videoUrls.back}
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: filterString }}
                controls={false}
                muted
                preload="auto"
                playsInline
                disablePictureInPicture
                ref={(video) => {
                  if (video && backRef.current) {
                    video.currentTime = backRef.current.currentTime
                    if (isPlaying) video.play()
                    else video.pause()
                  }
                }}
              />
            ) : (
              <Box style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
{t('videoGrid.back')} (데모 모드)
              </Box>
            )
          )}
          
          {fullscreenCamera === 'right' && (
            videoUrls.right_repeater ? (
              <video
                src={videoUrls.right_repeater}
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: filterString }}
                controls={false}
                muted
                preload="auto"
                playsInline
                disablePictureInPicture
                ref={(video) => {
                  if (video && rightRef.current) {
                    video.currentTime = rightRef.current.currentTime
                    if (isPlaying) video.play()
                    else video.pause()
                  }
                }}
              />
            ) : (
              <Box style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
{t('videoGrid.rightRepeater')} (데모 모드)
              </Box>
            )
          )}
          
          {fullscreenCamera === 'left' && (
            videoUrls.left_repeater ? (
              <video
                src={videoUrls.left_repeater}
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: filterString }}
                controls={false}
                muted
                preload="auto"
                playsInline
                disablePictureInPicture
                ref={(video) => {
                  if (video && leftRef.current) {
                    video.currentTime = leftRef.current.currentTime
                    if (isPlaying) video.play()
                    else video.pause()
                  }
                }}
              />
            ) : (
              <Box style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
{t('videoGrid.leftRepeater')} (데모 모드)
              </Box>
            )
          )}
        </Box>
      )}

      {/* 비디오 그리드 - 2x2 형태 */}
      <Box style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 상단 행 */}
        <Box style={{ display: 'flex', height: '50%' }}>
          {/* 전방 카메라 */}
          <Paper 
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 0,
              backgroundColor: 'black',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              borderRight: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={() => setHoveredCamera('front')}
            onMouseLeave={() => setHoveredCamera(null)}
            onClick={() => toggleFullscreen('front')}
          >
            {videoUrls.front ? (
              <video
                ref={frontRef}
                src={videoUrls.front}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: filterString }}
                controls={false}
                muted
                preload="auto"
                playsInline
                disablePictureInPicture
                onLoadedMetadata={(e) => {
                  const video = e.target as HTMLVideoElement
                  if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
                    onVideoDurationUpdate(video.duration)
                  }
                }}
              />
            ) : (
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--mantine-color-dimmed)' }}>
{t('videoGrid.noVideo')}
              </Box>
            )}
            {/* 호버 시 전체화면 아이콘 표시 */}
            {hoveredCamera === 'front' && (
              <Box style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box style={{ 
                  backgroundColor: 'rgba(0,0,0,0.7)', 
                  backdropFilter: 'blur(4px)', 
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text size="xl" c="white" style={{ lineHeight: 1 }}>⛶</Text>
                </Box>
                {!videoUrls.front && (
                  <Box style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', textAlign: 'center', color: 'white', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '4px' }}>
                    전체화면 기능 (데모)
                  </Box>
                )}
              </Box>
            )}
          </Paper>
          
          {/* 후방 카메라 */}
          <Paper 
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 0,
              backgroundColor: 'black',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              borderLeft: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={() => setHoveredCamera('back')}
            onMouseLeave={() => setHoveredCamera(null)}
            onClick={() => toggleFullscreen('back')}
          >
            {videoUrls.back ? (
              <video
                ref={backRef}
                src={videoUrls.back}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: filterString }}
                controls={false}
                muted
                preload="auto"
                playsInline
                disablePictureInPicture
              />
            ) : (
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--mantine-color-dimmed)' }}>
{t('videoGrid.noVideo')}
              </Box>
            )}
            {hoveredCamera === 'back' && (
              <Box style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box style={{ 
                  backgroundColor: 'rgba(0,0,0,0.7)', 
                  backdropFilter: 'blur(4px)', 
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text size="xl" c="white" style={{ lineHeight: 1 }}>⛶</Text>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
        
        {/* 하단 행 */}
        <Box style={{ display: 'flex', height: '50%' }}>
          {/* 우측 카메라 */}
          <Paper 
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 0,
              backgroundColor: 'black',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={() => setHoveredCamera('right')}
            onMouseLeave={() => setHoveredCamera(null)}
            onClick={() => toggleFullscreen('right')}
          >
            {videoUrls.right_repeater ? (
              <video
                ref={rightRef}
                src={videoUrls.right_repeater}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: filterString }}
                controls={false}
                muted
                preload="auto"
                playsInline
                disablePictureInPicture
              />
            ) : (
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--mantine-color-dimmed)' }}>
{t('videoGrid.noVideo')}
              </Box>
            )}
            {hoveredCamera === 'right' && (
              <Box style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box style={{ 
                  backgroundColor: 'rgba(0,0,0,0.7)', 
                  backdropFilter: 'blur(4px)', 
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text size="xl" c="white" style={{ lineHeight: 1 }}>⛶</Text>
                </Box>
              </Box>
            )}
          </Paper>
          
          {/* 좌측 카메라 */}
          <Paper 
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 0,
              backgroundColor: 'black',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={() => setHoveredCamera('left')}
            onMouseLeave={() => setHoveredCamera(null)}
            onClick={() => toggleFullscreen('left')}
          >
            {videoUrls.left_repeater ? (
              <video
                ref={leftRef}
                src={videoUrls.left_repeater}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: filterString }}
                controls={false}
                muted
                preload="auto"
                playsInline
                disablePictureInPicture
              />
            ) : (
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--mantine-color-dimmed)' }}>
{t('videoGrid.noVideo')}
              </Box>
            )}
            {hoveredCamera === 'left' && (
              <Box style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box style={{ 
                  backgroundColor: 'rgba(0,0,0,0.7)', 
                  backdropFilter: 'blur(4px)', 
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text size="xl" c="white" style={{ lineHeight: 1 }}>⛶</Text>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

    </Box>
  )
}