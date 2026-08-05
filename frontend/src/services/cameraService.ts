// ============================================================
// NDURANCE — Camera Service
// Detects USB cameras, assigns LEFT / BACK / RIGHT positions
// TODO: Backend Integration Point — richer device info via Electron/Tauri
// ============================================================

import type { CameraDevice, CameraPosition } from '../types/session.types';

// Known built-in webcam keywords to filter out.
// NOTE: 'camera' / 'webcam' were previously in this list, but most real USB UVC
// cameras also report those exact words in their label (e.g. "USB2.0 HD UVC
// WebCam", "HD Camera"), so that wrongly excluded genuine USB cameras. Only
// keep keywords that are specific to laptop-integrated cameras.
// TODO: Backend Integration Point — replace with native USB metadata from Electron/Tauri.
const BUILTIN_KEYWORDS = ['facetime', 'built-in', 'integrated', 'internal', 'isight'];

const isBuiltIn = (label: string): boolean => {
  const normalized = label.toLowerCase();
  return BUILTIN_KEYWORDS.some(k => normalized.includes(k));
};

export const cameraService = {
  /**
   * Detect all available camera devices.
   * Filters out built-in webcams — prefers USB cameras.
   * TODO: Backend Integration Point — Electron/Tauri can provide richer USB metadata
   */
  async detectCameras(): Promise<CameraDevice[]> {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !navigator.mediaDevices?.enumerateDevices) {
        return [];
      }

      // Request permission to enumerate devices, then immediately release the
      // probe stream — otherwise it keeps that physical camera locked and
      // CameraPanel's later getUserMedia call for the same device fails
      // with "device in use" (NotReadableError).
      const probe = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);
      probe?.getTracks().forEach(t => t.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(d => d.kind === 'videoinput' && d.deviceId)
        // Stable order so LEFT/BACK/RIGHT assignment doesn't shuffle between scans.
        .sort((a, b) => a.deviceId.localeCompare(b.deviceId));

      return videoDevices.map((device, index) => ({
        id: device.deviceId || `cam-${index}`,
        deviceId: device.deviceId,
        name: device.label || `USB Camera ${index + 1}`,
        resolution: '1920×1080', // TODO: Backend Integration Point — detect actual resolution
        connectionStatus: 'connected' as const,
        isBuiltIn: isBuiltIn(device.label || ''),
      }));
    } catch {
      // TODO: Backend Integration Point — fallback to backend camera list
      return [];
    }
  },

  /**
   * Get only external (USB) cameras, filtered from detected list.
   */
  async getCameraList(): Promise<CameraDevice[]> {
    const all = await cameraService.detectCameras();
    const external = all.filter(c => !c.isBuiltIn).slice(0, 3);

    // Prefer the first three external USB cameras only.
    if (external.length > 0) {
      return external;
    }

    return all.slice(0, 3);
  },

  /**
   * Auto-assign LEFT / BACK / RIGHT to detected cameras (by index order).
   */
  assignCameras(cameras: CameraDevice[]): CameraDevice[] {
    const positions: CameraPosition[] = ['LEFT', 'BACK', 'RIGHT'];
    return cameras.slice(0, 3).map((cam, i) => ({
      ...cam,
      assignedPosition: positions[i],
    }));
  },

  /**
   * Assign a specific position to a camera (manual override).
   */
  assignCamera(cameras: CameraDevice[], deviceId: string, position: CameraPosition): CameraDevice[] {
    return cameras.map(cam =>
      cam.deviceId === deviceId ? { ...cam, assignedPosition: position } : cam
    );
  },

  /**
   * Re-scan devices (e.g. after USB plug/unplug).
   * TODO: Backend Integration Point — backend WebSocket for real-time device events
   */
  async refreshDevices(): Promise<CameraDevice[]> {
    return cameraService.getCameraList();
  },

  /**
   * Listen for device changes (plug/unplug).
   */
  onDeviceChange(callback: () => void): () => void {
    if (!navigator.mediaDevices?.addEventListener) {
      return () => undefined;
    }

    navigator.mediaDevices.addEventListener('devicechange', callback);
    return () => navigator.mediaDevices.removeEventListener('devicechange', callback);
  },
};
