export type CameraType = 'front' | 'back' | 'left_repeater' | 'right_repeater' | 'left_pillar' | 'right_pillar'

export type LayoutMode = '2x2' | '3x2'

export interface LayoutPosition {
  row: number
  col: number
  camera: CameraType | null
}

export interface LayoutConfig {
  mode: LayoutMode
  positions: LayoutPosition[]
}

export const DEFAULT_LAYOUTS: Record<LayoutMode, LayoutConfig> = {
  '2x2': {
    mode: '2x2',
    positions: [
      { row: 0, col: 0, camera: 'front' },          // 좌측상단
      { row: 0, col: 1, camera: 'back' },           // 우측상단
      { row: 1, col: 0, camera: 'right_repeater' }, // 좌측하단
      { row: 1, col: 1, camera: 'left_repeater' }   // 우측하단
    ]
  },
  '3x2': {
    mode: '3x2',
    positions: [
      { row: 0, col: 0, camera: 'left_pillar' },    // 좌측상단
      { row: 0, col: 1, camera: 'front' },          // 중앙상단
      { row: 0, col: 2, camera: 'right_pillar' },   // 우측상단
      { row: 1, col: 0, camera: 'left_repeater' },  // 좌측하단
      { row: 1, col: 1, camera: 'back' },           // 중앙하단
      { row: 1, col: 2, camera: 'right_repeater' }  // 우측하단
    ]
  }
}

export const CAMERA_LABELS: Record<CameraType, string> = {
  front: 'Front',
  back: 'Back',
  left_repeater: 'L Repeater',
  right_repeater: 'R Repeater',
  left_pillar: 'L Pillar',
  right_pillar: 'R Pillar'
}