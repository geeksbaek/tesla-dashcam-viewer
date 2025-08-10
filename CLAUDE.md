# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tesla dashcam video viewer application built with React, TypeScript, and Vite. The app allows users to load Tesla dashcam files with multiple camera angles (front, back, left repeater, right repeater) and synchronize playback across all cameras simultaneously.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Core Components
- **App.tsx**: Main application state management and video timeline control
  - Manages global state for video playback, timeline navigation, and UI settings
  - Handles video seeking, playback rate, and seek mode (time/frame)
  - Controls sidebar expansion and video filter states
- **VideoGrid.tsx**: Handles multi-camera video playback and synchronization
  - Manages 4-6 video elements simultaneously with perfect sync
  - Implements frame-by-frame stepping and time-based seeking
  - Handles fullscreen mode and camera switching
  - Displays real-time timestamp overlays
- **ControlPanel.tsx**: Sidebar with video navigation and controls
  - Video playlist with automatic scrolling to current video
  - Playback controls and seek mode toggle
  - Video filter controls including license plate optimization
  - Video fit mode selection (cover/contain)
  - Language selection and settings
- **FileSelect.tsx**: Initial file loading interface
  - Drag-and-drop support for bulk file loading
  - Automatic file grouping by timestamp
  - Support for HW3 (4-channel) and HW4 (6-channel) file structures
- **VideoFilterControls.tsx**: Video enhancement filters
  - License plate optimization mode (F key)
  - Brightness, contrast, saturation adjustments
  - Grayscale and sharpening filters
- **UpdatePrompt.tsx**: PWA update management
  - Automatic detection and installation of new versions
  - Service worker registration and update handling
- **LanguageSelect.tsx**: Multi-language support
  - 10 language options with automatic detection
  - Persistent language preference storage

### Video Structure
The app expects Tesla dashcam files organized by timestamp with optional camera files:
```typescript
interface VideoFile {
  timestamp: string // Format: YYYY-MM-DD_HH-MM-SS
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
  left_pillar?: File
  right_pillar?: File
}
```

### Key Features
- **Multi-camera sync**: All videos play in perfect synchronization
- **Timeline navigation**: Global timeline spanning multiple video clips
- **Fullscreen mode**: Click any camera view to fullscreen
- **Keyboard controls**: Space (play/pause), Arrow keys (seek/frame stepping)
- **Playback modes**: Time-based seeking or frame-by-frame navigation

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Mantine Core + Radix UI components
- **Styling**: Tailwind CSS
- **Icons**: Tabler Icons + Lucide React

## Development Notes

### Video Synchronization
The VideoGrid component manages complex video synchronization logic using refs and custom events. When modifying video playback:
- All video elements must stay synchronized via `currentTime` updates
- State changes are batched to prevent desync
- Custom events handle frame-stepping across videos
- Frame rate detection for accurate frame-by-frame navigation
- Buffering state management across all video elements
- Keyboard event handling for playback control

### State Management
The main App component manages all global state including:
- Current video index and time position
- Global timeline position (spans multiple clips)
- Playback controls and seek modes
- Sidebar expansion state
- Video filters (brightness, contrast, saturation, etc.)
- Video fit mode (cover/contain)
- Video durations for accurate timeline calculation
- Playback rate (0.1x - 1.0x)

### File Handling
Video files are loaded as File objects and converted to object URLs for playback:
- Automatic grouping by timestamp pattern (YYYY-MM-DD_HH-MM-SS)
- Support for partial video sets (not all cameras required)
- URLs are properly cleaned up on component unmount to prevent memory leaks
- Real-time duration detection for accurate timeline calculation

## Path Aliases

The project uses `@/` as an alias for the `src/` directory (configured in vite.config.ts).

## Styling Approach

- Primarily uses Mantine components for UI elements
- Tailwind for utility classes and layout
- Custom styling via style props for video-specific layouts
- Dark theme optimized for video playback
- Responsive design with mobile-friendly controls
- Custom CSS filters for video enhancement

## Important Implementation Details

### PWA Configuration
- Service worker with offline caching support
- App manifest for installability
- Automatic update detection and installation
- Configured in vite.config.ts with VitePWA plugin

### Internationalization
- i18next for translation management
- Language detection from browser settings
- Persistent language preference in localStorage
- 10 supported languages: EN, KO, ZH, DE, NB, NL, FR, SV, DA, ES

### Keyboard Shortcuts
- Space: Play/Pause
- Arrow keys: Seek/Frame step
- Number keys 1-6: Camera fullscreen
- F: License plate filter toggle
- Event handlers in VideoGrid component

### Performance Optimizations
- Lazy loading of video metadata
- Efficient memory management with cleanup
- Optimized re-renders with React.memo and useCallback
- Batched state updates to prevent UI lag