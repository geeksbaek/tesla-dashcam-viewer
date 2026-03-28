/**
 * Tesla Dashcam SEI Metadata Decoder
 *
 * Adapted from https://github.com/teslamotors/dashcam (dashcam-mp4.js)
 * Extracts SEI (Supplemental Enhancement Information) metadata embedded
 * in Tesla dashcam MP4 files (firmware 2025.44.25+, HW3+).
 */

import { GearState, AutopilotState, type SeiMetadata, type SeiFrame } from '@/types/sei'

// ─── MP4 Box Navigation ────────────────────────────────────────────

interface Box {
  start: number
  end: number
  size: number
}

function findBox(view: DataView, start: number, end: number, name: string): Box | null {
  for (let pos = start; pos + 8 <= end;) {
    let size = view.getUint32(pos)
    const type = readAscii(view, pos + 4, 4)
    const headerSize = size === 1 ? 16 : 8

    if (size === 1) {
      const high = view.getUint32(pos + 8)
      const low = view.getUint32(pos + 12)
      size = Number((BigInt(high) << 32n) | BigInt(low))
    } else if (size === 0) {
      size = end - pos
    }

    if (size < 8) return null // invalid box

    if (type === name) {
      return { start: pos + headerSize, end: pos + size, size: size - headerSize }
    }
    pos += size
  }
  return null
}

function readAscii(view: DataView, start: number, len: number): string {
  let s = ''
  for (let i = 0; i < len; i++) s += String.fromCharCode(view.getUint8(start + i))
  return s
}

// ─── Frame Duration Extraction ─────────────────────────────────────

function getFrameDurationsMs(view: DataView): number[] {
  const moov = findBox(view, 0, view.byteLength, 'moov')
  if (!moov) return []

  const trak = findBox(view, moov.start, moov.end, 'trak')
  if (!trak) return []

  const mdia = findBox(view, trak.start, trak.end, 'mdia')
  if (!mdia) return []

  // Get timescale from mdhd
  const mdhd = findBox(view, mdia.start, mdia.end, 'mdhd')
  if (!mdhd) return []

  const mdhdVersion = view.getUint8(mdhd.start)
  const timescale = mdhdVersion === 1
    ? view.getUint32(mdhd.start + 20)
    : view.getUint32(mdhd.start + 12)

  if (timescale === 0) return []

  const minf = findBox(view, mdia.start, mdia.end, 'minf')
  if (!minf) return []

  const stbl = findBox(view, minf.start, minf.end, 'stbl')
  if (!stbl) return []

  const stts = findBox(view, stbl.start, stbl.end, 'stts')
  if (!stts) return []

  const entryCount = view.getUint32(stts.start + 4)
  const durations: number[] = []
  let pos = stts.start + 8

  for (let i = 0; i < entryCount; i++) {
    const count = view.getUint32(pos)
    const delta = view.getUint32(pos + 4)
    const ms = (delta / timescale) * 1000
    for (let j = 0; j < count; j++) durations.push(ms)
    pos += 8
  }

  return durations
}

// ─── SEI Extraction from mdat ──────────────────────────────────────

interface FrameInfo {
  sei: SeiMetadata | null
}

function parseVideoFrames(buffer: ArrayBuffer, view: DataView): FrameInfo[] {
  const moov = findBox(view, 0, view.byteLength, 'moov')
  if (!moov) return []

  const mdat = findBox(view, 0, view.byteLength, 'mdat')
  if (!mdat) return []

  const frames: FrameInfo[] = []
  let cursor = mdat.start
  const end = mdat.end
  let pendingSei: SeiMetadata | null = null

  while (cursor + 4 <= end) {
    const nalSize = view.getUint32(cursor)
    cursor += 4

    if (nalSize < 1 || cursor + nalSize > view.byteLength) break

    const nalType = view.getUint8(cursor) & 0x1F

    if (nalType === 6) {
      // SEI NAL unit
      pendingSei = decodeSeiNal(new Uint8Array(buffer, cursor, nalSize))
    } else if (nalType === 5 || nalType === 1) {
      // IDR (keyframe) or Slice - this is a video frame
      frames.push({ sei: pendingSei })
      pendingSei = null
    }

    cursor += nalSize
  }

  return frames
}

// ─── SEI NAL Decoding ──────────────────────────────────────────────

function decodeSeiNal(nal: Uint8Array): SeiMetadata | null {
  if (nal.length < 4) return null

  // Look for Tesla's SEI marker: sequence of 0x42 bytes followed by 0x69
  let i = 3
  while (i < nal.length && nal[i] === 0x42) i++
  if (i <= 3 || i + 1 >= nal.length || nal[i] !== 0x69) return null

  try {
    const payload = stripEmulationBytes(nal.subarray(i + 1, nal.length - 1))
    return decodeProtobuf(payload)
  } catch {
    return null
  }
}

/** Strip H.264 emulation prevention bytes (0x000003 → 0x0000) */
function stripEmulationBytes(data: Uint8Array): Uint8Array {
  const out: number[] = []
  let zeros = 0
  for (const byte of data) {
    if (zeros >= 2 && byte === 0x03) {
      zeros = 0
      continue
    }
    out.push(byte)
    zeros = byte === 0 ? zeros + 1 : 0
  }
  return Uint8Array.from(out)
}

// ─── Protobuf Decoder (Manual, zero dependencies) ──────────────────
//
// SeiMetadata protobuf schema (from dashcam.proto):
//   1: uint32  version
//   2: enum    gear_state       (varint)
//   3: uint64  frame_seq_no     (varint)
//   4: float   vehicle_speed_mps
//   5: float   accelerator_pedal_position
//   6: float   steering_wheel_angle
//   7: bool    blinker_on_left  (varint)
//   8: bool    blinker_on_right (varint)
//   9: bool    brake_applied    (varint)
//  10: enum    autopilot_state  (varint)
//  11: double  latitude_deg
//  12: double  longitude_deg
//  13: double  heading_deg
//  14: double  linear_acceleration_mps2_x
//  15: double  linear_acceleration_mps2_y
//  16: double  linear_acceleration_mps2_z

function readVarint(data: Uint8Array, offset: number): { value: number; newOffset: number } {
  let value = 0
  let shift = 0
  while (offset < data.length) {
    const byte = data[offset++]
    value += (byte & 0x7F) * (2 ** shift)
    if ((byte & 0x80) === 0) break
    shift += 7
    if (shift > 63) break
  }
  return { value, newOffset: offset }
}

function decodeProtobuf(rawData: Uint8Array): SeiMetadata {
  // Copy to ensure clean buffer alignment for DataView
  const data = new Uint8Array(rawData.length)
  data.set(rawData)
  const view = new DataView(data.buffer)
  let offset = 0

  const result: SeiMetadata = {
    version: 0,
    gearState: GearState.PARK,
    frameSeqNo: 0,
    vehicleSpeedMps: 0,
    acceleratorPedalPosition: 0,
    steeringWheelAngle: 0,
    blinkerOnLeft: false,
    blinkerOnRight: false,
    brakeApplied: false,
    autopilotState: AutopilotState.NONE,
    latitudeDeg: 0,
    longitudeDeg: 0,
    headingDeg: 0,
    linearAccelerationX: 0,
    linearAccelerationY: 0,
    linearAccelerationZ: 0,
  }

  while (offset < data.length) {
    const tag = readVarint(data, offset)
    offset = tag.newOffset
    const fieldNumber = tag.value >>> 3
    const wireType = tag.value & 0x7

    switch (wireType) {
      case 0: {
        // Varint: uint32, uint64, bool, enum
        const val = readVarint(data, offset)
        offset = val.newOffset
        switch (fieldNumber) {
          case 1: result.version = val.value; break
          case 2: result.gearState = val.value as GearState; break
          case 3: result.frameSeqNo = val.value; break
          case 7: result.blinkerOnLeft = val.value !== 0; break
          case 8: result.blinkerOnRight = val.value !== 0; break
          case 9: result.brakeApplied = val.value !== 0; break
          case 10: result.autopilotState = val.value as AutopilotState; break
        }
        break
      }
      case 1: {
        // 64-bit: double
        if (offset + 8 > data.length) return result
        const val = view.getFloat64(offset, true)
        offset += 8
        switch (fieldNumber) {
          case 11: result.latitudeDeg = val; break
          case 12: result.longitudeDeg = val; break
          case 13: result.headingDeg = val; break
          case 14: result.linearAccelerationX = val; break
          case 15: result.linearAccelerationY = val; break
          case 16: result.linearAccelerationZ = val; break
        }
        break
      }
      case 5: {
        // 32-bit: float
        if (offset + 4 > data.length) return result
        const val = view.getFloat32(offset, true)
        offset += 4
        switch (fieldNumber) {
          case 4: result.vehicleSpeedMps = val; break
          case 5: result.acceleratorPedalPosition = val; break
          case 6: result.steeringWheelAngle = val; break
        }
        break
      }
      case 2: {
        // Length-delimited (skip unknown embedded messages/strings)
        const len = readVarint(data, offset)
        offset = len.newOffset + len.value
        break
      }
      default:
        return result
    }
  }

  return result
}

// ─── Public API ────────────────────────────────────────────────────

/**
 * Parse SEI metadata from a Tesla dashcam MP4 file.
 * Returns time-indexed array of SEI frames for real-time lookup during playback.
 */
export async function parseSeiFromFile(file: File): Promise<SeiFrame[]> {
  const buffer = await file.arrayBuffer()
  return parseSeiFromBuffer(buffer)
}

export function parseSeiFromBuffer(buffer: ArrayBuffer): SeiFrame[] {
  const view = new DataView(buffer)

  const durations = getFrameDurationsMs(view)
  const frames = parseVideoFrames(buffer, view)

  const timeline: SeiFrame[] = []
  let cumulativeMs = 0

  for (let i = 0; i < frames.length && i < durations.length; i++) {
    if (frames[i].sei) {
      timeline.push({
        timeSeconds: cumulativeMs / 1000,
        sei: frames[i].sei!,
      })
    }
    cumulativeMs += durations[i]
  }

  return timeline
}

/**
 * Binary search for the SEI metadata at a given playback time.
 * Returns the most recent SEI data at or before the given time.
 */
export function findSeiAtTime(timeline: SeiFrame[], timeSeconds: number): SeiMetadata | null {
  if (timeline.length === 0) return null

  let low = 0
  let high = timeline.length - 1

  while (low <= high) {
    const mid = (low + high) >>> 1
    if (timeline[mid].timeSeconds <= timeSeconds) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return high >= 0 ? timeline[high].sei : timeline[0].sei
}
