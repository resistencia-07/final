// ============================================================
// NDURANCE — Display Service
// Detects secondary monitors for camera view window
// TODO: Backend Integration Point — Electron/Tauri for native multi-display
// ============================================================

import type { DisplayDevice } from '../types/session.types';

export const displayService = {
  /**
   * Detect available displays.
   * NOTE: Browser APIs have limited multi-display support.
   * TODO: Backend Integration Point — use Electron screen API or Tauri for real display info
   */
  async detectDisplays(): Promise<DisplayDevice[]> {
    const displays: DisplayDevice[] = [];

    if (typeof window === 'undefined') {
      return displays;
    }

    const primary: DisplayDevice = {
      id: 'primary',
      name: 'Primary Display',
      isPrimary: true,
      width: window.screen.width,
      height: window.screen.height,
      connectionType: 'wired',
    };

    displays.push(primary);

    const screenAny = window.screen as Screen & { isExtended?: boolean };
    const extended = screenAny.isExtended === true;
    const widthHint = window.screen.width > window.innerWidth + 240;

    if (extended || widthHint) {
      const connectionType = extended ? 'wired' : 'wireless';
      displays.push({
        id: 'secondary',
        name: extended ? 'Secondary Display' : 'External Display',
        isPrimary: false,
        width: window.screen.width,
        height: window.screen.height,
        connectionType,
      });
    }

    return displays;
  },

  /**
   * Check if a secondary display is connected.
   */
  async isSecondaryConnected(): Promise<boolean> {
    const displays = await displayService.detectDisplays();
    return displays.some(d => !d.isPrimary);
  },

  /**
   * Route the camera preview to a secondary window when the browser allows it.
   * TODO: Backend Integration Point — Electron/Tauri will implement this natively.
   * Browser fallback: open a popup and keep the developer UI on the laptop.
   */
  moveCameraWindow(url: string): Window | null {
    if (typeof window === 'undefined' || typeof window.open !== 'function') {
      return null;
    }

    try {
      const secondaryX = Math.max(0, (window.screenLeft ?? window.screenX ?? 0) + (window.outerWidth ?? window.innerWidth));
      const secondaryY = window.screenTop ?? window.screenY ?? 0;
      const width = Math.max(360, Math.min(960, window.screen.width || 1024));
      const height = Math.max(640, Math.min(1600, window.screen.height || 768));

      return window.open(
        url,
        'ndurance-camera',
        `left=${secondaryX},top=${secondaryY},width=${width},height=${height},popup=1,noopener,noreferrer`
      );
    } catch {
      return null;
    }
  },

  /**
   * Browser limitations make true multi-display routing unreliable.
   * TODO: Electron/Tauri — use native screen APIs for deterministic secondary display routing.
   */
  canRouteToSecondaryDisplay(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const screenAny = window.screen as Screen & { isExtended?: boolean };
    return screenAny.isExtended === true || window.screen.width > window.innerWidth + 240;
  },

  /**
   * Re-check display connection status.
   */
  async refreshDisplays(): Promise<DisplayDevice[]> {
    return displayService.detectDisplays();
  },

  /**
   * Listen for display connection changes.
   * TODO: Backend Integration Point — Electron provides ipcMain events for display changes
   */
  onDisplayChange(callback: () => void): () => void {
    window.addEventListener('resize', callback);
    window.addEventListener('orientationchange', callback);
    return () => {
      window.removeEventListener('resize', callback);
      window.removeEventListener('orientationchange', callback);
    };
  },
};
