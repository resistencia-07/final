// ============================================================
// NDURANCE — Session Context
// Holds live session state (cameras, metrics, recording)
// ============================================================

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CameraDevice, DisplayDevice, SessionMetrics, RecordingState, CameraPosition } from '../types/session.types';
import { cameraService } from '../services/cameraService';
import { displayService } from '../services/displayService';

interface SessionContextType {
  cameras: CameraDevice[];
  displays: DisplayDevice[];
  metrics: SessionMetrics;
  recordingState: RecordingState;
  isSecondaryConnected: boolean;
  detectDevices: () => Promise<void>;
  updateMetrics: (m: Partial<SessionMetrics>) => void;
  setRecordingState: (s: RecordingState) => void;
  swapCamera: (deviceId: string, position: CameraPosition) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

const DEFAULT_METRICS: SessionMetrics = {
  heartRate: 0,
  speed: 0,
  steps: 0,
  elapsedTime: 0,
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [displays, setDisplays] = useState<DisplayDevice[]>([]);
  const [metrics, setMetrics] = useState<SessionMetrics>(DEFAULT_METRICS);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [isSecondaryConnected, setIsSecondaryConnected] = useState(false);

  const detectDevices = useCallback(async () => {
    const [detected, allDisplays] = await Promise.all([
      cameraService.getCameraList(),
      displayService.detectDisplays(),
    ]);
    const assigned = cameraService.assignCameras(detected);
    setCameras(assigned);
    setDisplays(allDisplays);
    setIsSecondaryConnected(allDisplays.some(d => !d.isPrimary));
  }, []);

  const updateMetrics = useCallback((m: Partial<SessionMetrics>) => {
    setMetrics(prev => ({ ...prev, ...m }));
  }, []);

  const swapCamera = useCallback((deviceId: string, position: CameraPosition) => {
    setCameras(prev => cameraService.assignCamera(prev, deviceId, position));
  }, []);

  return (
    <SessionContext.Provider value={{
      cameras, displays, metrics, recordingState, isSecondaryConnected,
      detectDevices, updateMetrics, setRecordingState, swapCamera,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
