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
- **VideoGrid.tsx**: Handles multi-camera video playback and synchronization
- **ControlPanel.tsx**: Sidebar with video navigation and controls
- **FileSelect.tsx**: Initial file loading interface

### Video Structure
The app expects Tesla dashcam files organized by timestamp with optional camera files:
```typescript
interface VideoFile {
  timestamp: string // Format: YYYY-MM-DD_HH-MM-SS
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
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

### State Management
The main App component manages all global state including:
- Current video index and time position
- Global timeline position (spans multiple clips)
- Playback controls and seek modes
- Sidebar expansion state

### File Handling
Video files are loaded as File objects and converted to object URLs for playback. URLs are properly cleaned up on component unmount to prevent memory leaks.

## Path Aliases

The project uses `@/` as an alias for the `src/` directory (configured in vite.config.ts).

## Styling Approach

- Primarily uses Mantine components for UI elements
- Tailwind for utility classes and layout
- Custom styling via style props for video-specific layouts
- Dark theme optimized for video playback