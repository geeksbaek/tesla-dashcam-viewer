import { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'
import { MantineProvider } from '@mantine/core'
import VideoGrid from './components/VideoGrid'
import FileSelect from './components/FileSelect'
import ControlPanel from './components/ControlPanel'
import { UpdatePrompt } from './components/UpdatePrompt'
import type { VideoFilters } from './components/VideoFilterControls'
import { theme } from './theme'

export interface VideoFile {
  timestamp: string
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
  left_pillar?: File
  right_pillar?: File
}

function App() {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [globalTime, setGlobalTime] = useState(0) // 전체 타임라인에서의 시간
  const [playbackRate, setPlaybackRate] = useState(1) // 재생 속도
  const [seekMode, setSeekMode] = useState<'frame' | 'time'>('time') // 이동 모드
  const [videoFrameRate, setVideoFrameRate] = useState(30) // 비디오 프레임레이트
  const [sidebarExpanded, setSidebarExpanded] = useState(true) // 사이드바 확장 상태
  const [videoDurations, setVideoDurations] = useState<number[]>([]) // 각 비디오의 실제 길이
  const [videoFilters, setVideoFilters] = useState<VideoFilters>({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    sharpen: false,
    invert: false,
    grayscale: false,
  })
  const [videoFitMode, setVideoFitMode] = useState<'cover' | 'contain'>('contain') // 비디오 피팅 모드

  const handleFilesLoaded = (files: VideoFile[]) => {
    setVideoFiles(files)
    setCurrentVideoIndex(0)
    setCurrentTime(0)
    setGlobalTime(0)
    // 초기에는 각 비디오를 60초로 가정
    setTotalDuration(files.length * 60)
    setVideoDurations(new Array(files.length).fill(60))
  }

  // 테스트용 더미 데이터 (개발 중에만 사용)
  const loadDummyData = () => {
    const dummyFiles: VideoFile[] = []
    // 20개의 더미 파일 생성
    for (let i = 0; i < 20; i++) {
      const minutes = 30 + Math.floor(i / 2)
      const seconds = (i % 2) * 30 + 25
      dummyFiles.push({
        timestamp: `2024-01-15_14-${minutes.toString().padStart(2, '0')}-${seconds.toString().padStart(2, '0')}`
      })
    }
    setVideoFiles(dummyFiles)
    setCurrentVideoIndex(0)
    setCurrentTime(15) // 15초 재생 중으로 시뮬레이션
    setGlobalTime(15)
    setTotalDuration(dummyFiles.length * 60)
    setVideoDurations(new Array(dummyFiles.length).fill(60))
  }

  const currentVideo = videoFiles[currentVideoIndex]

  // 시간 업데이트 핸들러 (최대한 단순화)
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
    // 현재 비디오까지의 누적 시간 계산
    if (videoDurations.length > currentVideoIndex) {
      const cumulativeTime = videoDurations.slice(0, currentVideoIndex).reduce((sum: number, dur: number) => sum + dur, 0)
      setGlobalTime(cumulativeTime + time)
    } else {
      // videoDurations가 아직 초기화되지 않은 경우 기본값 사용
      setGlobalTime(currentVideoIndex * 60 + time)
    }
  }

  // 슬라이더로 시간 이동
  const handleSeek = useCallback((newGlobalTime: number, fromArrowKey: boolean = false) => {
    // 실제 비디오 길이를 사용하여 올바른 비디오 인덱스와 시간 찾기
    let remainingTime = newGlobalTime
    let videoIndex = 0
    
    if (videoDurations.length > 0) {
      for (let i = 0; i < videoDurations.length; i++) {
        if (remainingTime < videoDurations[i]) {
          videoIndex = i
          break
        }
        remainingTime -= videoDurations[i]
      }
    } else {
      // videoDurations가 아직 초기화되지 않은 경우
      videoIndex = Math.floor(newGlobalTime / 60)
      remainingTime = newGlobalTime % 60
    }
    
    let videoTime = remainingTime
    
    // 좌측 방향키로 이전 비디오로 이동하는 경우
    // 이전 비디오의 끝 부분으로 이동하여 첫 프레임 플래시 방지
    if (fromArrowKey && videoIndex < currentVideoIndex && videoDurations[videoIndex] > 0) {
      // 이전 비디오의 끝 시간으로 설정 (마지막 프레임이 보이도록)
      // remainingTime이 음수인 경우는 이전 비디오의 끝부분을 의미
      if (remainingTime < 5) {
        // 5초 미만으로 남은 경우 끝에서 약간 앞으로
        videoTime = Math.max(0, videoDurations[videoIndex] - 0.5)
      }
    }
    
    // flushSync를 사용하여 모든 상태를 동기적으로 업데이트
    flushSync(() => {
      if (videoIndex !== currentVideoIndex && videoIndex < videoFiles.length) {
        setCurrentVideoIndex(videoIndex)
      }
      setCurrentTime(videoTime)
      setGlobalTime(newGlobalTime)
    })
  }, [currentVideoIndex, videoFiles.length, videoDurations])

  // 비디오 선택
  const handleVideoSelect = useCallback((index: number) => {
    setCurrentVideoIndex(index)
    setCurrentTime(0)
    // 선택한 비디오까지의 누적 시간 계산
    if (videoDurations.length > index) {
      const cumulativeTime = videoDurations.slice(0, index).reduce((sum: number, dur: number) => sum + dur, 0)
      setGlobalTime(cumulativeTime)
    } else {
      setGlobalTime(index * 60)
    }
  }, [videoDurations])

  // 재생 속도 변경
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
  }

  // 이동 모드 변경
  const handleSeekModeChange = (mode: 'frame' | 'time') => {
    setSeekMode(mode)
  }

  // 프레임레이트 업데이트
  const handleFrameRateUpdate = (frameRate: number) => {
    setVideoFrameRate(frameRate)
  }

  // 비디오 길이 업데이트
  const handleVideoDurationUpdate = (duration: number) => {
    if (duration > 0 && videoDurations[currentVideoIndex] !== duration) {
      const newDurations = [...videoDurations]
      newDurations[currentVideoIndex] = duration
      setVideoDurations(newDurations)
      
      // 총 재생 시간 재계산
      const newTotalDuration = newDurations.reduce((sum, dur) => sum + dur, 0)
      setTotalDuration(newTotalDuration)
    }
  }

  // 첫 페이지로 이동
  const handleGoToHome = () => {
    setVideoFiles([])
    setCurrentVideoIndex(0)
    setCurrentTime(0)
    setGlobalTime(0)
    setTotalDuration(0)
    setIsPlaying(false)
  }

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 입력 요소에 포커스가 있는 경우 무시
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      
      if (event.code === 'Space') {
        event.preventDefault()
        setIsPlaying(!isPlaying)
      } else if (event.code === 'ArrowLeft') {
        event.preventDefault()
        
        if (seekMode === 'frame') {
          // 프레임 이동은 VideoGrid에서 직접 처리하도록 이벤트 발생
          window.dispatchEvent(new CustomEvent('frameSeek', { 
            detail: { direction: -1, frameRate: videoFrameRate } 
          }))
        } else {
          // 5초 뒤로 이동
          const newTime = Math.max(0, globalTime - 5)
          const newVideoIndex = Math.floor(newTime / 60)
          
          // 이전 클립으로 넘어가는 경우 특별 처리
          if (newVideoIndex < currentVideoIndex) {
            // newTime을 그대로 사용 (이미 적절히 계산됨)
            handleSeek(newTime, true)
          } else {
            handleSeek(newTime, true)
          }
        }
      } else if (event.code === 'ArrowRight') {
        event.preventDefault()
        
        if (seekMode === 'frame') {
          // 프레임 이동은 VideoGrid에서 직접 처리하도록 이벤트 발생
          window.dispatchEvent(new CustomEvent('frameSeek', { 
            detail: { direction: 1, frameRate: videoFrameRate } 
          }))
        } else {
          // 5초 앞으로 이동
          const newTime = Math.min(totalDuration, globalTime + 5)
          handleSeek(newTime, true) // fromArrowKey = true
        }
      } else if (event.code === 'KeyF') {
        event.preventDefault()
        // 번호판 인식 최적화 필터 토글
        const isLicensePlateMode = 
          videoFilters.brightness === 100 &&
          videoFilters.contrast === 150 &&
          videoFilters.saturate === 0 &&
          videoFilters.sharpen === true &&
          videoFilters.grayscale === true;
        
        if (isLicensePlateMode) {
          // 기본 필터로 전환
          setVideoFilters({
            brightness: 100,
            contrast: 100,
            saturate: 100,
            sharpen: false,
            invert: false,
            grayscale: false,
          })
        } else {
          // 번호판 인식 최적화 필터로 전환
          setVideoFilters({
            brightness: 100,
            contrast: 150,
            saturate: 0,
            sharpen: true,
            invert: false,
            grayscale: true,
          })
        }
      } else if (event.code === 'Digit1') {
        event.preventDefault()
        // 전방 카메라 전체화면 (1번)
        window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'front' } }))
      } else if (event.code === 'Digit2') {
        event.preventDefault()
        // 현재 비디오가 6채널인지 확인
        const currentVideo = videoFiles[currentVideoIndex]
        if (currentVideo && (currentVideo.left_pillar || currentVideo.right_pillar)) {
          // 6채널: 우측 B필러 카메라 전체화면 (2번)
          window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'rightPillar' } }))
        } else {
          // 4채널: 후방 카메라 전체화면 (2번)
          window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'back' } }))
        }
      } else if (event.code === 'Digit3') {
        event.preventDefault()
        // 현재 비디오가 6채널인지 확인
        const currentVideo = videoFiles[currentVideoIndex]
        if (currentVideo && (currentVideo.left_pillar || currentVideo.right_pillar)) {
          // 6채널: 좌측 B필러 카메라 전체화면 (3번)
          window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'leftPillar' } }))
        } else {
          // 4채널: 우측 리피터 카메라 전체화면 (3번)
          window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'right' } }))
        }
      } else if (event.code === 'Digit4') {
        event.preventDefault()
        // 현재 비디오가 6채널인지 확인
        const currentVideo = videoFiles[currentVideoIndex]
        if (currentVideo && (currentVideo.left_pillar || currentVideo.right_pillar)) {
          // 6채널: 후방 카메라 전체화면 (4번)
          window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'back' } }))
        } else {
          // 4채널: 좌측 리피터 카메라 전체화면 (4번)
          window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'left' } }))
        }
      } else if (event.code === 'Digit5') {
        event.preventDefault()
        // 6채널만: 우측 리피터 카메라 전체화면 (5번)
        const currentVideo = videoFiles[currentVideoIndex]
        if (currentVideo && (currentVideo.left_pillar || currentVideo.right_pillar)) {
          window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'right' } }))
        }
      } else if (event.code === 'Digit6') {
        event.preventDefault()
        // 6채널만: 좌측 리피터 카메라 전체화면 (6번)
        const currentVideo = videoFiles[currentVideoIndex]
        if (currentVideo && (currentVideo.left_pillar || currentVideo.right_pillar)) {
          window.dispatchEvent(new CustomEvent('toggleFullscreen', { detail: { camera: 'left' } }))
        }
      } else if (event.code === 'ArrowUp') {
        event.preventDefault()
        // 이전 클립으로 이동
        if (currentVideoIndex > 0) {
          handleVideoSelect(currentVideoIndex - 1)
        }
      } else if (event.code === 'ArrowDown') {
        event.preventDefault()
        // 다음 클립으로 이동
        if (currentVideoIndex < videoFiles.length - 1) {
          handleVideoSelect(currentVideoIndex + 1)
        }
      } else if (event.code === 'KeyV') {
        event.preventDefault()
        // 비디오 피팅 모드 토글
        setVideoFitMode(prevMode => prevMode === 'contain' ? 'cover' : 'contain')
      } else if (event.code === 'KeyM') {
        event.preventDefault()
        // 이동 모드 토글 (시간 <-> 프레임)
        setSeekMode(prevMode => prevMode === 'time' ? 'frame' : 'time')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying, globalTime, totalDuration, handleSeek, seekMode, currentVideoIndex, videoFilters, handleVideoSelect, videoFiles, videoFitMode, videoFrameRate])

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <UpdatePrompt />
      <div className="font-apple" style={{ 
        height: '100vh', 
        width: '100vw', 
        backgroundColor: 'black', 
        overflow: 'hidden', 
        position: 'relative' 
      }}>
        {!videoFiles.length ? (
          <FileSelect onFilesLoaded={handleFilesLoaded} onLoadDummy={loadDummyData} />
        ) : (
          <>
            <VideoGrid 
              videoFile={currentVideo}
              videoFiles={videoFiles}
              currentVideoIndex={currentVideoIndex}
              isPlaying={isPlaying}
              currentTime={currentTime}
              globalTime={globalTime}
              duration={totalDuration}
              playbackRate={playbackRate}
              seekMode={seekMode}
              sidebarExpanded={sidebarExpanded}
              videoFilters={videoFilters}
              videoFitMode={videoFitMode}
              onTimeUpdate={handleTimeUpdate}
              onSeek={handleSeek}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onVideoSelect={handleVideoSelect}
              onPlaybackRateChange={handlePlaybackRateChange}
              onSeekModeChange={handleSeekModeChange}
              onFrameRateUpdate={handleFrameRateUpdate}
              onVideoDurationUpdate={handleVideoDurationUpdate}
            />
            <ControlPanel
              videoFiles={videoFiles}
              currentIndex={currentVideoIndex}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onVideoSelect={handleVideoSelect}
              globalTime={globalTime}
              totalDuration={totalDuration}
              isExpanded={sidebarExpanded}
              onToggleExpanded={setSidebarExpanded}
              seekMode={seekMode}
              onSeekModeChange={handleSeekModeChange}
              onGoToHome={handleGoToHome}
              videoDurations={videoDurations}
              videoFilters={videoFilters}
              onVideoFiltersChange={setVideoFilters}
              videoFitMode={videoFitMode}
              onVideoFitModeChange={setVideoFitMode}
              playbackRate={playbackRate}
              onPlaybackRateChange={handlePlaybackRateChange}
            />
          </>
        )}
      </div>
    </MantineProvider>
  )
}

export default App