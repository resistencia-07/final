// ============================================================
// NDURANCE — Session Types
// ============================================================

export type RecordingState = 'idle' | 'countdown' | 'recording' | 'paused' | 'stopped';
export type CameraPosition = 'LEFT' | 'BACK' | 'RIGHT';
export type ChecklistItemStatus = 'pending' | 'ready' | 'error';

export interface CameraDevice {
  id: string;
  name: string;
  deviceId: string;
  resolution?: string;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  isBuiltIn: boolean;
  assignedPosition?: CameraPosition;
}

export interface DisplayDevice {
  id: string;
  name: string;
  isPrimary: boolean;
  width?: number;
  height?: number;
  refreshRate?: number;
  connectionType?: 'wired' | 'wireless' | 'unknown';
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistItemStatus;
  required: boolean;
}

export interface SessionMetrics {
  heartRate: number;   // BPM
  speed: number;       // km/h
  steps: number;       // total steps
  elapsedTime: number; // seconds
}

export interface SessionData {
  id: string;
  athleteId: string;
  startedAt: string;
  stoppedAt?: string;
  metrics: SessionMetrics;
  cameras: CameraDevice[];
  recordingState: RecordingState;
}

export interface ReportData {
  session: SessionData;
  avgHeartRate: number;
  maxHeartRate: number;
  avgSpeed: number;
  maxSpeed: number;
  totalSteps: number;
  performanceScore: number;
  cameraQuality: Record<CameraPosition, number>;
}
