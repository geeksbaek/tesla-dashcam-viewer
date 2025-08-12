import type { LayoutConfig, LayoutMode } from '@/types/layout'
import { DEFAULT_LAYOUTS } from '@/types/layout'

const LAYOUT_STORAGE_KEY = 'tesla-dashcam-layout'

export function saveLayoutConfig(config: LayoutConfig): void {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save layout config:', error)
  }
}

export function loadLayoutConfig(mode: LayoutMode): LayoutConfig {
  try {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY)
    if (stored) {
      const config = JSON.parse(stored) as LayoutConfig
      if (config.mode === mode) {
        return config
      }
    }
  } catch (error) {
    console.error('Failed to load layout config:', error)
  }
  
  return DEFAULT_LAYOUTS[mode]
}

export function resetLayoutConfig(mode: LayoutMode): void {
  try {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY)
    if (stored) {
      const config = JSON.parse(stored) as LayoutConfig
      if (config.mode === mode) {
        localStorage.removeItem(LAYOUT_STORAGE_KEY)
      }
    }
  } catch (error) {
    console.error('Failed to reset layout config:', error)
  }
}