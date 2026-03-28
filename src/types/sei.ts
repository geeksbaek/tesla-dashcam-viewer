export enum GearState {
  PARK = 0,
  DRIVE = 1,
  REVERSE = 2,
  NEUTRAL = 3,
}

export enum AutopilotState {
  NONE = 0,
  SELF_DRIVING = 1,
  AUTOSTEER = 2,
  TACC = 3,
}

export interface SeiMetadata {
  version: number
  gearState: GearState
  frameSeqNo: number
  vehicleSpeedMps: number
  acceleratorPedalPosition: number
  steeringWheelAngle: number
  blinkerOnLeft: boolean
  blinkerOnRight: boolean
  brakeApplied: boolean
  autopilotState: AutopilotState
  latitudeDeg: number
  longitudeDeg: number
  headingDeg: number
  linearAccelerationX: number
  linearAccelerationY: number
  linearAccelerationZ: number
}

export interface SeiFrame {
  timeSeconds: number
  sei: SeiMetadata
}
