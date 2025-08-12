import { Button, Paper, Text, Title, Group, Stack, Box, ActionIcon, SegmentedControl, Tooltip, Modal, Progress } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconChevronLeft, IconChevronRight, IconVideo, IconPlayerTrackNext, IconBrandGithub, IconVideoFilled, IconPlayerPlayFilled, IconPlayerPauseFilled, IconSettingsFilled, IconHomeFilled, IconDownload, IconLayout } from '@tabler/icons-react'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSelect from './LanguageSelect'
import VideoFilterControls from './VideoFilterControls'
import type { VideoFilters } from './VideoFilterControls'
import { LayoutEditor } from './LayoutEditor'
import type { LayoutConfig } from '@/types/layout'


interface VideoFile {
  timestamp: string
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
  left_pillar?: File
  right_pillar?: File
}

// Helper function for formatting timestamps
const formatTimestampHelper = (baseTimestamp: string, additionalSeconds: number = 0, language: string = 'en') => {
  try {
    const parts = baseTimestamp.split('_');
    if (parts.length !== 2) return baseTimestamp.replace(/_/g, ' ').replace(/-/g, ':');
    const datePart = parts[0];
    const timePart = parts[1];
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split('-').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + Math.floor(additionalSeconds);
    const newHours = Math.floor(totalSeconds / 3600) % 24;
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSecs = totalSeconds % 60;
    const date = new Date(year, month - 1, day, newHours, newMinutes, newSecs);
    const formatter = new Intl.DateTimeFormat(language, { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return formatter.format(date);
  } catch {
    return baseTimestamp.replace(/_/g, ' ').replace(/-/g, ':');
  }
};

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
  videoFitMode: 'cover' | 'contain',
  onVideoFitModeChange: (mode: 'cover' | 'contain') => void
  playbackRate: number
  onPlaybackRateChange: (rate: number) => void
  layoutMode: '2x2' | '3x2' // 현재 레이아웃 모드
  onLayoutChange?: (config: LayoutConfig) => void
  customLayout?: LayoutConfig // 커스텀 레이아웃 설정
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
  videoFitMode,
  onVideoFitModeChange,
  playbackRate,
  onPlaybackRateChange,
  layoutMode,
  onLayoutChange,
  customLayout
}: ControlPanelProps) {
  const { t, i18n } = useTranslation();
  const videoListRef = useRef<HTMLDivElement>(null);
  const expandedVideoListRef = useRef<HTMLDivElement>(null);
  const currentButtonRef = useRef<HTMLButtonElement>(null);
  const currentExpandedItemRef = useRef<HTMLDivElement>(null);
  const [encodingProgress, setEncodingProgress] = useState<number>(0);
  const [encodingEta, setEncodingEta] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [layoutEditorOpened, setLayoutEditorOpened] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoElementsRef = useRef<HTMLVideoElement[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  // Check browser support for video encoding technologies
  const checkBrowserSupport = useCallback(() => {
    const support = {
      mediaRecorder: typeof MediaRecorder !== 'undefined',
      canvas: typeof document !== 'undefined' && document.createElement('canvas').getContext('2d') !== null,
      webm: MediaRecorder?.isTypeSupported?.('video/webm;codecs=vp9') || false,
      mp4: MediaRecorder?.isTypeSupported?.('video/mp4;codecs=h264') || false,
      requestAnimationFrame: typeof requestAnimationFrame !== 'undefined'
    };

    const isSupported = support.mediaRecorder && support.canvas && support.requestAnimationFrame && (support.webm || support.mp4);
    
    return {
      isSupported,
      details: support
    };
  }, []);

  const handleDownload = useCallback(async (video: VideoFile) => {
    if (isModalOpen) return;

    const browserSupport = checkBrowserSupport();

    // Show explanation modal first
    modals.openConfirmModal({
      title: t('download.confirmTitle', { defaultValue: 'Video Download' }),
      centered: true,
      size: 'md',
      style: { '--modal-size': '540px' },
      children: (
        <Stack gap="md">
          <Text size="sm">
            {t('download.explanation')}
          </Text>
          <Box
            style={{
              backgroundColor: 'var(--mantine-color-yellow-light)',
              borderLeft: '4px solid var(--mantine-color-yellow-filled)',
              padding: '8px 12px',
              borderRadius: '4px'
            }}
          >
            <Text size="xs" c="yellow" fw={500}>
              {t('download.qualityNote', { 
                defaultValue: '⚠️ Quality may be reduced from original due to browser encoding limitations' 
              })}
            </Text>
          </Box>
          <Box
            style={{
              backgroundColor: 'var(--mantine-color-red-light)',
              borderLeft: '4px solid var(--mantine-color-red-filled)',
              padding: '8px 12px',
              borderRadius: '4px'
            }}
          >
            <Text size="xs" c="red" fw={500}>
              {t('download.browserWarning', { 
                defaultValue: '⚠️ This feature uses MediaRecorder API, Canvas API, and advanced video codecs. Browser support is limited and unexpected issues like frame drops may occur.' 
              })}
            </Text>
          </Box>
          <Text size="xs" c="dimmed">
            {t('download.note', { 
              defaultValue: 'Note: The encoding process may take a few minutes depending on video length.' 
            })}
          </Text>
          {!browserSupport.isSupported && (
            <Box
              style={{
                backgroundColor: 'var(--mantine-color-gray-light)',
                borderLeft: '4px solid var(--mantine-color-gray-filled)',
                padding: '8px 12px',
                borderRadius: '4px'
              }}
            >
              <Text size="xs" c="red" fw={500}>
                {t('download.unsupportedBrowser', { 
                  defaultValue: '❌ Your browser does not support the required encoding technologies (MediaRecorder API, Canvas API, or video codecs). Please use a modern browser like Chrome, Firefox, or Edge.' 
                })}
              </Text>
            </Box>
          )}
        </Stack>
      ),
      labels: { 
        confirm: t('download.start', { defaultValue: 'Start Download' }), 
        cancel: t('controlPanel.cancel', { defaultValue: 'Cancel' }) 
      },
      confirmProps: { 
        color: 'blue',
        disabled: !browserSupport.isSupported
      },
      cancelProps: { variant: 'default' },
      groupProps: { gap: 8 },
      onConfirm: async () => {
        // Start the actual download process
        setIsModalOpen(true);
        setEncodingProgress(0);
        setEncodingEta('');
        startTimeRef.current = Date.now();
        isCancelledRef.current = false;

        try {
      // Use custom layout if available, otherwise use default order
      let cameraOrder: string[];
      
      // Check if we have pillar cameras
      const hasPillarCameras = video.left_pillar || video.right_pillar;
      const currentLayoutMode = hasPillarCameras ? '3x2' : '2x2';
      
      if (customLayout && customLayout.mode === currentLayoutMode) {
        // Use custom layout order
        cameraOrder = customLayout.positions
          .filter(p => p.camera)
          .sort((a, b) => {
            // Sort by row first, then by column
            if (a.row !== b.row) return a.row - b.row;
            return a.col - b.col;
          })
          .map(p => p.camera!)
      } else {
        // Use default camera order
        const defaultOrder6Channel = ['front', 'right_pillar', 'left_pillar', 'back', 'right_repeater', 'left_repeater'];
        const defaultOrder4Channel = ['front', 'back', 'right_repeater', 'left_repeater'];
        cameraOrder = hasPillarCameras ? defaultOrder6Channel : defaultOrder4Channel;
      }
      
      // Create sources in the correct order to match viewer layout
      const sources = cameraOrder
        .filter(camera => video[camera as keyof typeof video] instanceof File)
        .map(camera => ({ camera, file: video[camera as keyof typeof video] as File }));

      // Find front camera for reference (use it for FPS and bitrate)
      const frontSource = sources.find(s => s.camera === 'front') || sources[0];
      
      const videoElements = await Promise.all(sources.map(s => loadVideo(URL.createObjectURL(s.file))));
      videoElementsRef.current = videoElements;
      
      // Get each video's resolution
      const videoResolutions = videoElements.map(video => ({
        width: video.videoWidth,
        height: video.videoHeight
      }));
      
      // Use front camera as master reference
      const frontIndex = sources.findIndex(s => s.camera === 'front');
      const masterVideo = frontIndex >= 0 ? videoElements[frontIndex] : videoElements[0];
      const duration = masterVideo.duration;
      const width = masterVideo.videoWidth;
      const height = masterVideo.videoHeight;

      // Try to get actual FPS by analyzing video frames
      let estimatedFPS = 30; // Default fallback
      
      // Method 1: Try to detect FPS by measuring frame changes
      const detectFPS = async (): Promise<number> => {
        return new Promise((resolve) => {
          const testVideo = document.createElement('video');
          testVideo.src = URL.createObjectURL(frontSource.file);
          testVideo.muted = true;
          testVideo.playbackRate = 1.0;
          
          let frameCount = 0;
          let lastTime = 0;
          
          const countFrames = () => {
            if (testVideo.currentTime !== lastTime) {
              frameCount++;
              lastTime = testVideo.currentTime;
            }
            
            if (testVideo.currentTime >= 1.0) {
              // Stop after 1 second
              testVideo.pause();
              const fps = Math.round(frameCount);
              URL.revokeObjectURL(testVideo.src);
              resolve(fps);
            } else if (testVideo.paused || testVideo.ended) {
              // Fallback
              URL.revokeObjectURL(testVideo.src);
              resolve(30);
            } else {
              requestAnimationFrame(countFrames);
            }
          };
          
          testVideo.onloadeddata = () => {
            testVideo.play().then(() => {
              requestAnimationFrame(countFrames);
            }).catch(() => {
              resolve(30); // Fallback if can't play
            });
          };
          
          testVideo.onerror = () => {
            resolve(30); // Fallback on error
          };
          
          // Timeout after 3 seconds
          setTimeout(() => {
            if (testVideo) {
              testVideo.pause();
              URL.revokeObjectURL(testVideo.src);
            }
            resolve(30);
          }, 3000);
        });
      };
      
      // Try to detect actual FPS
      try {
        console.log('Detecting FPS from video...');
        estimatedFPS = await detectFPS();
        
        // Validate detected FPS (Tesla typically uses 24, 30, 33, or 36 FPS)
        const validFPS = [24, 30, 33, 36];
        if (!validFPS.includes(estimatedFPS)) {
          // Round to nearest valid FPS
          const nearest = validFPS.reduce((prev, curr) => 
            Math.abs(curr - estimatedFPS) < Math.abs(prev - estimatedFPS) ? curr : prev
          );
          console.log(`Detected FPS ${estimatedFPS} rounded to ${nearest}`);
          estimatedFPS = nearest;
        }
      } catch (e) {
        console.warn('FPS detection failed, using fallback', e);
        // Fallback based on resolution
        if (width === 1280 && height === 960) {
          estimatedFPS = 36; // HW2.5/HW3
        } else if (width >= 2880) {
          estimatedFPS = 30; // HW4
        }
      }
      
      console.log(`Using FPS: ${estimatedFPS}`);

      // Create canvas for combining videos
      const [cols, rows] = layoutMode === '2x2' ? [2, 2] : [3, 2];
      const numCameras = videoElements.length;
      
      // Find the smallest video resolution (usually 1448x938 for HW4)
      // Use this as the base size for all videos in the grid
      let minWidth = Math.min(...videoResolutions.map(r => r.width));
      let minHeight = Math.min(...videoResolutions.map(r => r.height));
      
      console.log(`Base resolution: ${minWidth}x${minHeight}`);
      
      // Check if the total canvas size would exceed limits
      const maxCanvasWidth = 3840;  // 4K width limit
      const maxCanvasHeight = 2160; // 4K height limit
      
      let canvasWidth = cols * minWidth;
      let canvasHeight = rows * minHeight;
      
      // Track resolution scaling factor for bitrate adjustment
      let resolutionScale = 1.0;
      
      // Scale down if needed to fit within limits
      if (canvasWidth > maxCanvasWidth || canvasHeight > maxCanvasHeight) {
        const scale = Math.min(maxCanvasWidth / canvasWidth, maxCanvasHeight / canvasHeight);
        resolutionScale = scale; // Store scale factor for bitrate adjustment
        minWidth = Math.floor(minWidth * scale);
        minHeight = Math.floor(minHeight * scale);
        canvasWidth = cols * minWidth;
        canvasHeight = rows * minHeight;
        console.log(`Scaled down to ${minWidth}x${minHeight} per cell to fit within limits (scale: ${scale.toFixed(3)})`);
      }
      
      // Create canvas with the calculated size
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // All videos will be scaled to this size
      const cellWidth = minWidth;
      const cellHeight = minHeight;
      const ctx = canvas.getContext('2d', { alpha: false })!;
      
      console.log(`Canvas size: ${canvas.width}x${canvas.height} (${cols}x${rows} grid, ${cellWidth}x${cellHeight} per cell)`);
      
      // Final safety check
      if (canvas.width > 3840 || canvas.height > 2160) {
        console.error(`Warning: Canvas size ${canvas.width}x${canvas.height} may cause encoder issues`);
      }

      // Estimate original video bitrate based on front camera file size and duration
      const fileSizeInBits = frontSource.file.size * 8;
      const estimatedBitrate = duration > 0 ? Math.floor(fileSizeInBits / duration) : 0;
      
      // Use estimated bitrate or fallback to 50 Mbps / number of cameras
      const fallbackBitratePerCamera = Math.floor(50000000 / numCameras);
      const baseVideoBitrate = estimatedBitrate > 0 ? estimatedBitrate : fallbackBitratePerCamera;
      
      // Calculate total bitrate based on front camera bitrate × number of cameras
      // 2x2 = 4 cameras, 3x2 = 6 cameras
      let totalBitrate = baseVideoBitrate * numCameras;
      
      // Apply resolution scaling to bitrate - if resolution is scaled down, reduce bitrate proportionally
      // Bitrate scales roughly with pixel count (width × height)
      const bitrateScale = resolutionScale * resolutionScale; // Square of resolution scale
      totalBitrate = Math.floor(totalBitrate * bitrateScale);
      
      // Cap at reasonable maximum to prevent issues
      totalBitrate = Math.min(totalBitrate, 100000000); // Cap at 100 Mbps
      
      // If calculation seems unreasonable (too low or too high), use 50 Mbps fallback
      if (totalBitrate < 5000000 || isNaN(totalBitrate)) {
        console.log('Bitrate calculation failed or too low, using 50 Mbps fallback');
        totalBitrate = 50000000;
      }
      
      const canvasPixels = canvas.width * canvas.height;
      const megaPixels = canvasPixels / 1000000;
      
      console.log(`Canvas: ${canvas.width}x${canvas.height} (${megaPixels.toFixed(1)} MP)`);
      console.log(`Resolution scaling: ${(resolutionScale * 100).toFixed(1)}% (bitrate scaled by ${(bitrateScale * 100).toFixed(1)}%)`);
      console.log(`Encoding settings: ${(totalBitrate / 1000000).toFixed(1)} Mbps (${numCameras} cameras × ${(baseVideoBitrate / 1000000).toFixed(1)} Mbps base), ${estimatedFPS} FPS`);
      console.log(`Video info: duration=${duration}s, file size=${(frontSource.file.size / 1024 / 1024).toFixed(1)}MB, original resolution=${width}x${height}`);
      
      // Setup MediaRecorder with conservative settings
      // Setup optimal capture stream with exact FPS matching
      const stream = canvas.captureStream(estimatedFPS); // Precise FPS matching for zero drops
      
      // Try to create MediaRecorder with supported codecs
      let mediaRecorder: MediaRecorder | null = null;
      
      // Check codec support first (MP4 prioritized, WebM as fallback)
      const supportedCodecs = [
        'video/mp4;codecs=h264',     // MP4 with H.264 (Safari, Chrome)
        'video/mp4',                  // MP4 default
        'video/webm;codecs=h264',     // WebM with H.264
        'video/webm;codecs=vp9',      // WebM with VP9
        'video/webm;codecs=vp8',      // WebM with VP8
        'video/webm'                  // WebM default
      ];
      
      let selectedCodec = 'video/webm';
      for (const codec of supportedCodecs) {
        if (MediaRecorder.isTypeSupported(codec)) {
          selectedCodec = codec;
          console.log(`Using codec: ${codec}`);
          break;
        }
      }
      
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: selectedCodec,
          videoBitsPerSecond: totalBitrate
        });
      } catch {
        console.warn(`Failed with calculated bitrate ${(totalBitrate / 1000000).toFixed(1)} Mbps, trying default`);
        // Try with default bitrate (2.5 Mbps)
        try {
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: selectedCodec
          });
          console.log('Using default bitrate (2.5 Mbps)');
        } catch (e2) {
          throw new Error(`Failed to initialize MediaRecorder: ${e2}`);
        }
      }
      
      if (!mediaRecorder) {
        throw new Error('Failed to initialize MediaRecorder');
      }
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstart = () => {
        // MediaRecorder started
      };
      
      mediaRecorder.onerror = (event: Event) => {
        const error = (event as ErrorEvent).error;
        console.error('MediaRecorder error:', error || event);
        alert(`Recording error: ${error?.message || 'Unknown error'}`);
      };

      mediaRecorder.onstop = () => {
        // Only save if we have data AND not cancelled
        if (chunks.length > 0 && !isCancelledRef.current) {
          // Use the selected codec type for the blob
          const mimeType = selectedCodec.split(';')[0]; // Get base mime type (video/mp4 or video/webm)
          const blob = new Blob(chunks, { type: mimeType });
          
          // Determine file extension based on codec
          const extension = selectedCodec.includes('mp4') ? 'mp4' : 'webm';
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${video.timestamp}.${extension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        
        // Cleanup
        videoElements.forEach(v => {
          v.pause();
          URL.revokeObjectURL(v.src);
        });
        videoElementsRef.current = [];
        mediaRecorderRef.current = null;
        
        // Close modal after cleanup
        if (!isCancelledRef.current) {
          setIsModalOpen(false);
        }
      };

      // Initialize videos - IMPORTANT: sync them perfectly
      // Slow down video playback to ensure frame capture can keep up
      const playbackRate = 0.5; // Even slower playback for more reliable frame capture
      for (const v of videoElements) {
        v.currentTime = 0;
        v.playbackRate = playbackRate; // Slower playback
        v.muted = true;
        v.volume = 0;
        v.preload = 'auto';
        
        // Enhanced buffering settings
        try {
          // Force full buffering if possible
          v.load();
        } catch {
          // Ignore load errors
        }
      }

      // Start recording with corrected timeslice to compensate for slower playback
      const correctedTimeslice = Math.floor((1000 / estimatedFPS) / playbackRate); // Adjust for slower playback
      console.log(`MediaRecorder timeslice: ${correctedTimeslice}ms (compensated for ${playbackRate}x playback)`);
      mediaRecorder.start(correctedTimeslice);

      // Start all videos in sync for automatic playback
      console.log('Starting video playback for capture...');
      try {
        await Promise.all(videoElements.map(v => v.play()));
        console.log('All videos started successfully');
      } catch (error) {
        console.error('Failed to start video playback:', error);
        videoElements.forEach(v => {
          v.play().catch(e => console.error('Play error:', e));
        });
      }

      // Frame-precise render system - back to automatic playback
      let animationId: number;
      let frameNumber = 0;
      const targetFrameTime = 1000 / estimatedFPS; // ms per frame
      let lastFrameTime = 0;
      const expectedFrames = Math.floor(duration * estimatedFPS); // Calculate expected frames upfront
      
      const render = (timestamp: number) => {
        // More lenient timing to capture more frames
        const adjustedFrameTime = targetFrameTime * 0.8; // Capture frames more frequently
        if (timestamp - lastFrameTime < adjustedFrameTime) {
          animationId = requestAnimationFrame(render);
          animationIdRef.current = animationId;
          return;
        }
        
        const currentTime = masterVideo.currentTime;
        
        // Force synchronization of all videos to master time
        videoElements.forEach((v, i) => {
          if (i !== 0) {
            const timeDiff = Math.abs(v.currentTime - currentTime);
            if (timeDiff > 0.016) { // More than 1 frame worth of difference
              v.currentTime = currentTime;
            }
          }
        });
        
        // Clear canvas with black background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw all videos
        let frameDrawn = true;
        videoElements.forEach((v, i) => {
          const x = (i % cols) * cellWidth;
          const y = Math.floor(i / cols) * cellHeight;
          
          try {
            // More lenient video readiness check
            if (v.readyState >= 2 && !v.paused) { // HAVE_CURRENT_DATA or higher
              ctx.drawImage(v, x, y, cellWidth, cellHeight);
            } else {
              frameDrawn = false;
            }
          } catch (e) {
            frameDrawn = false;
            if (frameNumber % 30 === 0) {
              console.warn(`Frame not ready for video ${i}:`, e);
            }
          }
          
          // Draw timestamp
          drawTimestamp(ctx, x, y, formatTimestampHelper(video.timestamp, currentTime, i18n.language), cellWidth);
        });
        
        // Capture frame if successful
        if (frameDrawn) {
          frameNumber++;
          lastFrameTime = timestamp;
          
          // Log detailed progress for monitoring
          if (frameNumber % 120 === 0) { // Every 4 seconds at 30fps
            console.log(`Frame capture progress: ${frameNumber}/${expectedFrames} frames (${(frameNumber/expectedFrames*100).toFixed(1)}%) at time ${currentTime.toFixed(2)}s/${duration.toFixed(1)}s`);
          }
        } else if (frameNumber % 60 === 0) {
          console.log(`Frame ${frameNumber} skipped - videos not ready`);
        }
        
        // Update progress based on actual video time (more accurate than frame counting)
        const timeProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
        const frameProgress = expectedFrames > 0 ? (frameNumber / expectedFrames) * 100 : 0;
        
        // Use weighted average of time and frame progress for smoother progression
        // Time progress is more reliable, so weight it more heavily
        const weightedProgress = (timeProgress * 0.7) + (frameProgress * 0.3);
        const roundedProgress = Math.round(Math.min(100, Math.max(0, weightedProgress)) * 10) / 10;
        
        // Debug logging for progress tracking
        if (frameNumber % 30 === 0) { // Log every 30 frames consistently
          console.log(`Progress: ${roundedProgress}% (time: ${timeProgress.toFixed(1)}%, frames: ${frameProgress.toFixed(1)}%, currentTime: ${currentTime.toFixed(1)}s/${duration.toFixed(1)}s, frames: ${frameNumber}/${expectedFrames})`);
        }
        
        setEncodingProgress(roundedProgress);
        
        // Update ETA based on time progress (more reliable than frame rate)
        if (startTimeRef.current && roundedProgress > 0 && roundedProgress < 100) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const progressRatio = roundedProgress / 100;
          if (progressRatio > 0.01) { // Only calculate after 1% to avoid wild estimates
            const estimatedTotal = elapsed / progressRatio;
            const remaining = estimatedTotal - elapsed;
            if (remaining > 0) {
              const mins = Math.floor(remaining / 60);
              const secs = Math.floor(remaining % 60);
              setEncodingEta(`${mins}:${secs.toString().padStart(2, '0')}`);
            }
          }
        } else if (roundedProgress >= 100) {
          setEncodingEta('');
        }
        
        // Check completion - be more strict to ensure all frames are captured
        const timeComplete = currentTime >= duration * 0.995 || masterVideo.ended;
        const frameComplete = frameNumber >= expectedFrames * 0.99; // Still allow 1% margin for frame counting
        // Only complete when BOTH conditions are close to completion
        const shouldComplete = timeComplete && (frameComplete || masterVideo.ended);
        
        if (!shouldComplete && !masterVideo.paused) {
          animationId = requestAnimationFrame(render);
          animationIdRef.current = animationId;
        } else {
          // Encoding complete - let the progress naturally reach 100%
          console.log(`Encoding complete: ${frameNumber} frames captured in ${currentTime.toFixed(2)}s`);
          console.log(`Completion reason - timeComplete: ${timeComplete}, frameComplete: ${frameComplete}, currentTime: ${currentTime.toFixed(2)}, duration: ${duration.toFixed(2)}`);
          console.log(`Final progress - time: ${timeProgress.toFixed(1)}%, frames: ${frameProgress.toFixed(1)}%, captured: ${frameNumber}/${expectedFrames} frames`);
          videoElements.forEach(v => v.pause());
          
          // Only set to 100% if we're very close to avoid sudden jumps
          if (roundedProgress >= 95) {
            setEncodingProgress(100);
          }
          
          // Enhanced stop sequence - ensure all frames are processed
          // Wait longer to ensure MediaRecorder has processed all frames
          setTimeout(() => {
            console.log('Stopping MediaRecorder after final frame processing...');
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }, 500); // Increased delay to ensure all frames are encoded
        }
      };
      
      // Start frame-precise rendering
      console.log('Starting frame capture...');
      lastFrameTime = performance.now();
      animationId = requestAnimationFrame(render);
      animationIdRef.current = animationId;
      
      } catch (error) {
        console.error('Error during video encoding setup:', error);
        alert(`Video encoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsModalOpen(false);
      }
      }
    });
  }, [isModalOpen, layoutMode, i18n.language, t, checkBrowserSupport, customLayout]);

  const loadVideo = (url: string): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      video.volume = 0;
      video.preload = 'auto';
      video.crossOrigin = 'anonymous';
      
      video.onloadeddata = () => {
        resolve(video);
      };
      
      video.onerror = (e) => {
        console.error('Video load error:', e);
        reject(e);
      };
    });
  }



  const drawTimestamp = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, width: number) => {
    const fontSize = 20;
    ctx.font = `${fontSize}px Arial`;
    const textMetrics = ctx.measureText(text);
    const padding = 10;
    const boxWidth = textMetrics.width + padding * 2;
    const boxHeight = fontSize + padding;
    
    // Position at top-right corner of each video
    const boxX = x + width - boxWidth - 10;
    const boxY = y + 10;
    
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.fillText(text, boxX + padding, boxY + fontSize);
  }
  
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
    
    return formatTimestampHelper(baseTimestamp, currentVideoTime, i18n.language)
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
      <Modal
        opened={isModalOpen}
        onClose={() => {
          // Confirm before closing using Mantine modals
          // const confirmMessage = encodingProgress > 0 
          //   ? t('download.cancelConfirm', { defaultValue: 'Cancel encoding in progress?' })
          //   : t('download.close', { defaultValue: 'Close?' });
            
          modals.openConfirmModal({
            title: encodingProgress > 0 ? t('download.cancelConfirm', { defaultValue: 'Cancel encoding?' }) : t('download.close', { defaultValue: 'Close?' }),
            centered: true,
            children: (
              <Text size="sm">
                {encodingProgress > 0 
                  ? t('download.cancelConfirmDetail', { 
                      defaultValue: '비디오 인코딩이 진행 중입니다. 취소하면 지금까지의 작업이 모두 사라집니다. 정말로 취소하시겠습니까?' 
                    })
                  : t('download.closeDetail', { 
                      defaultValue: '다운로드 대화상자를 닫으시겠습니까? 아직 인코딩을 시작하지 않았으므로 언제든지 다시 다운로드를 시작할 수 있습니다.' 
                    })}
              </Text>
            ),
            labels: { 
              confirm: t('controlPanel.confirm', { defaultValue: 'Confirm' }), 
              cancel: t('controlPanel.cancel', { defaultValue: 'Cancel' }) 
            },
            confirmProps: { color: 'red' },
            cancelProps: { variant: 'default' },
            groupProps: { gap: 8 },
            onConfirm: () => {
              // Mark as cancelled
              isCancelledRef.current = true;
              
              // Cancel encoding
              if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
              }
              
              // Stop all videos
              videoElementsRef.current.forEach(v => {
                v.pause();
                URL.revokeObjectURL(v.src);
              });
              videoElementsRef.current = [];
              
              // Stop recording if active (this will trigger onstop but won't download due to isCancelledRef)
              if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
              }
              mediaRecorderRef.current = null;
              
              setIsModalOpen(false);
              setEncodingProgress(0);
              setEncodingEta('');
            }
          });
        }}
        title={t('download.title')}
        centered
        size="sm"
        closeOnClickOutside={false}
        closeOnEscape={false}
        styles={{
          title: {
            fontSize: '16px',
            fontWeight: 600,
          },
          body: {
            padding: '20px',
          }
        }}
      >
        <Stack gap="md">
          <Progress 
            value={encodingProgress} 
            striped 
            animated 
            size="lg"
            styles={{
              root: { height: 8 }
            }}
          />
          <Group justify="space-between">
            <Text size="sm" fw={500} c="dimmed">
              {`${encodingProgress.toFixed(1)}%`}
            </Text>
            <Text size="sm" fw={500} c="dimmed">
              {encodingEta && t('download.eta', { time: encodingEta })}
            </Text>
          </Group>
        </Stack>
      </Modal>
      {/* 축소된 사이드바 */}
      {!isExpanded && (
        <Paper
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            width: '80px',
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
                    variant={index === currentIndex ? "filled" : "subtle"}
                    color={index === currentIndex ? "tesla-red" : undefined}
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
              <Stack gap={4} align="center">
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
              </Stack>
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
          <Box>
            <Button
              onClick={onPlayPause}
              size="sm"
              variant="light"
              fullWidth
              onFocus={(e) => e.target.blur()}
            >
              {isPlaying ? 
                <Group gap="xs" align="center">
                  <IconPlayerPauseFilled size={16} />
                  <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t('controlPanel.pause')} 
                    <kbd style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>Space</kbd>
                  </Text>
                </Group> : 
                <Group gap="xs" align="center">
                  <IconPlayerPlayFilled size={16} />
                  <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t('controlPanel.play')} 
                    <kbd style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>Space</kbd>
                  </Text>
                </Group>
              }
            </Button>
          </Box>

          {/* 방향키 이동 모드 선택 */}
          <Box>
            <Stack gap="xs">
              <Group gap="xs" align="center">
                <IconSettingsFilled size={16} />
                <Text size="sm" fw={600} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t('controlPanel.seekMode')}
                  <kbd style={{ 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}>M</kbd>
                </Text>
              </Group>
              <SegmentedControl
                value={seekMode}
                onChange={(value) => onSeekModeChange(value as 'frame' | 'time')}
                data={[
                  { label: `${t('controlPanel.frameMode')}`, value: 'frame' },
                  { label: `${t('controlPanel.timeMode')}`, value: 'time' }
                ]}
                size="xs"
                fullWidth
                style={{ 
                  pointerEvents: 'auto'
                }}
                onFocus={(e) => e.target.blur()}
              />
            </Stack>
          </Box>

          {/* 재생 속도 선택 */}
          <Box>
            <Stack gap="xs">
              <Group gap="xs" align="center">
                <IconPlayerTrackNext size={16} />
                <Text size="sm" fw={600}>{t('controlPanel.playbackSpeed', '재생 속도')}</Text>
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
          </Box>

          {/* 클립 목록 - 스크롤 가능 */}
          <Box style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Stack gap="xs" style={{ height: '100%' }}>
            <Group justify="space-between" align="center">
              <Group gap="xs" align="center">
                <IconVideoFilled size={16} />
                <Text size="sm" fw={600} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t('controlPanel.videos')}
                  <span style={{ display: 'inline-flex', gap: '2px' }}>
                    <kbd style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>▲</kbd>
                    <kbd style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>▼</kbd>
                    <kbd style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>◀</kbd>
                    <kbd style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>▶</kbd>
                  </span>
                </Text>
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
                        padding: '4px 8px',
                        borderRadius: 'var(--mantine-radius-default)',
                        backgroundColor: isActive 
                          ? 'var(--mantine-color-tesla-red-filled)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isActive 
                          ? '1px solid var(--mantine-color-tesla-red-6)' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onClick={() => onVideoSelect(index)}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                          e.currentTarget.style.borderColor = 'var(--mantine-color-tesla-red-4)'
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
                      
                      {/* 텍스트 및 다운로드 버튼 컨테이너 */}
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Text 
                          size="xs" 
                          fw={500} 
                          truncate
                          c={isActive ? 'white' : undefined}
                          style={{ lineHeight: 1 }}
                        >
                          {isActive ? 
                            getCurrentTimestamp() : 
                            formatTimestampHelper(video.timestamp, 0, i18n.language)
                          }
                        </Text>
                        <ActionIcon 
                          size="sm" 
                          variant="subtle"
                          onClick={(e) => {
                            e.stopPropagation(); // 이벤트 버블링 방지
                            handleDownload(video);
                          }}
                          disabled={isModalOpen}
                        >
                          <IconDownload size={16} />
                        </ActionIcon>
                      </div>
                    </div>
                  )
                })}
              </Stack>
            </Box>
            </Stack>
          </Box>
          
          {/* 비디오 필터 컨트롤 */}
          <Box>
            <VideoFilterControls 
              filters={videoFilters}
              onFiltersChange={onVideoFiltersChange}
            />
          </Box>
          
          {/* 레이아웃 편집 버튼 */}
          <Box>
            <Button
              onClick={() => setLayoutEditorOpened(true)}
              size="sm"
              variant="light"
              fullWidth
              leftSection={<IconLayout size={16} />}
              onFocus={(e) => e.target.blur()}
            >
              {t('layout.editButton')}
            </Button>
          </Box>
          
          {/* 비디오 피팅 모드 컨트롤 */}
          <Box>
            <Stack gap="xs">
              <Group gap="xs" align="center">
                <IconVideo size={16} />
                <Text size="sm" fw={600} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t('controlPanel.videoFitting')}
                  <kbd style={{ 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}>V</kbd>
                </Text>
              </Group>
              <SegmentedControl
                value={videoFitMode}
                onChange={(value) => onVideoFitModeChange(value as 'cover' | 'contain')}
                data={[
                  { 
                    label: t('controlPanel.fitModes.contain'), 
                    value: 'contain' 
                  },
                  { 
                    label: t('controlPanel.fitModes.cover'), 
                    value: 'cover' 
                  }
                ]}
                size="sm"
                style={{ width: '100%' }}
                onFocus={(e) => e.target.blur()}
                tabIndex={-1}
              />
            </Stack>
          </Box>
        </Stack>
        
        {/* 첫 페이지로 이동 버튼 - 하단 고정 */}
        <Box style={{ 
          paddingTop: '16px'
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
      
      {/* 레이아웃 편집 다이얼로그 */}
      <LayoutEditor
        opened={layoutEditorOpened}
        onClose={() => setLayoutEditorOpened(false)}
        videoFiles={videoFiles}
        onLayoutChange={onLayoutChange}
      />
    </>
  )
}