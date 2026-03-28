# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tesla dashcam video viewer — a client-side React+TypeScript PWA that loads Tesla dashcam files (drag-and-drop), groups them by timestamp, and plays 4-6 camera angles in perfect sync. Deployed to GitHub Pages at `/tesla-dashcam-viewer/`.

## Development Commands

```bash
npm run dev       # Start dev server (rolldown-vite, not standard Vite)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test framework is configured. Linting is the only automated check.

## Git Hooks

- **pre-commit**: Runs `lint-staged` (ESLint --fix on staged `*.{ts,tsx}`)
- **pre-push**: Runs `npm run build` — push is blocked if build fails

## Architecture

### Data Flow

```
FileSelect (drag-and-drop)
  → groups files by YYYY-MM-DD_HH-MM-SS timestamp
  → App (all state: playback, timeline, filters, layout)
    → VideoGrid (sync 4-6 <video> elements, keyboard controls)
    → ControlPanel (sidebar: playlist, filters, settings)
```

All global state lives in `App.tsx` — no state management library. Props flow down; callbacks flow up.

### Video Synchronization (VideoGrid.tsx)

The most complex component. Key constraints when modifying:
- All video elements must stay synchronized via `currentTime` updates
- State changes are batched (including `flushSync`) to prevent desync
- Frame-by-frame stepping requires detected frame rate from video metadata
- Buffering state is tracked across all video elements simultaneously
- Keyboard events (Space, arrows, number keys, F) are handled here

### Layout System (types/layout.ts, utils/layoutStorage.ts, LayoutEditor.tsx)

Camera grid positions are configurable via drag-and-drop (`@dnd-kit`). Two modes:
- `2x2`: HW3 vehicles (front, back, left/right repeater)
- `3x2`: HW4 vehicles (adds left/right pillar cameras)

Layout configs persist to localStorage.

### SEI Metadata (utils/seiDecoder.ts, hooks/useSeiMetadata.ts, types/sei.ts)

Decodes Tesla-proprietary SEI (Supplemental Enhancement Information) from MP4 files (firmware 2025.44.25+, HW3+). Extracts per-frame vehicle telemetry: speed, GPS, steering angle, gear, autopilot state, etc. Parsed results are cached in a `WeakMap<File, SeiFrame[]>` for GC-friendly reuse.

### Internationalization (i18n/)

10 languages via i18next. Translation files in `src/i18n/locales/*.json`. When adding UI strings, add keys to all 10 locale files (en, ko, zh, de, nb, nl, fr, sv, da, es). English (`en.json`) is the fallback.

## Key Conventions

- **Path alias**: `@/` maps to `src/` (configured in both vite.config.ts and tsconfig.json)
- **Build tool**: Uses `rolldown-vite` (not standard Vite) — see `"vite": "npm:rolldown-vite@latest"` in package.json
- **Base path**: `/tesla-dashcam-viewer/` — all assets and routes are relative to this
- **Version**: Injected at build time via `import.meta.env.VITE_APP_VERSION` from package.json
- **Styling**: Mantine components + Tailwind utilities, dark theme only
- **PWA**: VitePWA plugin with prompt-based update flow (not auto-update)
