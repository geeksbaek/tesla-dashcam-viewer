import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { GearState, AutopilotState, type SeiMetadata } from '@/types/sei'

interface SeiOverlayProps {
  currentSei: SeiMetadata | null
  isLoading: boolean
  hasSeiData: boolean
  visible: boolean
}

const GEAR_CONFIG: Record<GearState, { label: string; color: string }> = {
  [GearState.PARK]: { label: 'P', color: '#3B82F6' },
  [GearState.DRIVE]: { label: 'D', color: '#22C55E' },
  [GearState.REVERSE]: { label: 'R', color: '#EF4444' },
  [GearState.NEUTRAL]: { label: 'N', color: '#6B7280' },
}

const AP_CONFIG: Record<AutopilotState, { label: string; color: string } | null> = {
  [AutopilotState.NONE]: null,
  [AutopilotState.SELF_DRIVING]: { label: 'FSD', color: '#8B5CF6' },
  [AutopilotState.AUTOSTEER]: { label: 'Autosteer', color: '#3B82F6' },
  [AutopilotState.TACC]: { label: 'TACC', color: '#14B8A6' },
}

function formatCoord(deg: number, pos: string, neg: string): string {
  return `${Math.abs(deg).toFixed(4)}°${deg >= 0 ? pos : neg}`
}

function headingToCompass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8]
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      ...monoStyle,
      fontSize: '0.6rem',
      fontWeight: 700,
      color: '#fff',
      backgroundColor: color,
      padding: '1px 6px',
      borderRadius: '3px',
      lineHeight: '1.4',
    }}>
      {label}
    </span>
  )
}

export default memo(function SeiOverlay({ currentSei, isLoading, hasSeiData, visible }: SeiOverlayProps) {
  const { t } = useTranslation()

  if (!visible || (!hasSeiData && !isLoading)) return null

  if (isLoading) {
    return (
      <div style={overlayStyle}>
        <span style={{ ...monoStyle, color: '#999', fontSize: '0.7rem' }}>
          {t('sei.loading')}
        </span>
      </div>
    )
  }

  if (!currentSei) return null

  const speedKmh = Math.round(currentSei.vehicleSpeedMps * 3.6)
  const gear = GEAR_CONFIG[currentSei.gearState] ?? GEAR_CONFIG[GearState.PARK]
  const ap = AP_CONFIG[currentSei.autopilotState]
  const hasGps = currentSei.latitudeDeg !== 0 || currentSei.longitudeDeg !== 0

  return (
    <div style={overlayStyle}>
      <div style={rowStyle}>
        {/* Speed */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span style={{ ...monoStyle, fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            {speedKmh}
          </span>
          <span style={{ ...monoStyle, fontSize: '0.6rem', color: '#999' }}>
            km/h
          </span>
        </div>

        <Badge label={gear.label} color={gear.color} />

        {ap && <Badge label={ap.label} color={ap.color} />}

        {/* Blinkers */}
        {currentSei.blinkerOnLeft && (
          <span style={{ ...monoStyle, fontSize: '0.75rem', color: '#F59E0B' }}>◀</span>
        )}
        {currentSei.blinkerOnRight && (
          <span style={{ ...monoStyle, fontSize: '0.75rem', color: '#F59E0B' }}>▶</span>
        )}

        {currentSei.brakeApplied && <Badge label="BRAKE" color="#DC2626" />}

        <div style={{ flex: 1 }} />

        {/* GPS + Heading */}
        {hasGps && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...monoStyle, fontSize: '0.6rem', color: '#999' }}>
              {formatCoord(currentSei.latitudeDeg, 'N', 'S')}{' '}
              {formatCoord(currentSei.longitudeDeg, 'E', 'W')}
            </span>
            <span style={{ ...monoStyle, fontSize: '0.6rem', color: '#6B7280' }}>
              {headingToCompass(currentSei.headingDeg)} {currentSei.headingDeg.toFixed(0)}°
            </span>
          </div>
        )}
      </div>
    </div>
  )
})

// ─── Styles ──────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
  padding: '16px 14px 8px',
  pointerEvents: 'none',
  zIndex: 10,
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
}

const monoStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
  userSelect: 'none',
}
