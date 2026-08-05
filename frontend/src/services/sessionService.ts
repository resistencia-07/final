// ============================================================
// NDURANCE — Session Service
// Recording hooks and session lifecycle placeholders
// TODO: Backend API — connect all methods to real endpoints
// ============================================================

import type { SessionData, SessionMetrics, RecordingState } from '../types/session.types';

// TODO: Backend Integration Point — import apiInstance
// import { apiInstance } from '../api/axiosInstance';

export const sessionService = {
  /**
   * Start a new recording session.
   * TODO: Backend API — POST /session/start
   */
  async startRecording(athleteId: string): Promise<SessionData> {
    // TODO: Backend Integration Point
    // return apiInstance.request<SessionData>('POST', '/session/start', { athleteId });
    void athleteId;
    throw new Error('TODO: Backend API — startRecording not connected');
  },

  /**
   * Pause recording.
   * TODO: Backend API — POST /session/:id/pause
   */
  async pauseRecording(sessionId: string): Promise<void> {
    // TODO: Backend Integration Point
    void sessionId;
  },

  /**
   * Resume recording.
   * TODO: Backend API — POST /session/:id/resume
   */
  async resumeRecording(sessionId: string): Promise<void> {
    // TODO: Backend Integration Point
    void sessionId;
  },

  /**
   * Stop recording and finalize session.
   * TODO: Backend API — POST /session/:id/stop
   */
  async stopRecording(sessionId: string): Promise<SessionData> {
    // TODO: Backend Integration Point
    // return apiInstance.request<SessionData>('POST', `/session/${sessionId}/stop`);
    void sessionId;
    throw new Error('TODO: Backend API — stopRecording not connected');
  },

  /**
   * Save session data (videos + report).
   * TODO: Backend API — POST /session/:id/save
   * Expected backend behaviour: saves left.mp4, back.mp4, right.mp4, report.pdf, session.json
   */
  async saveSession(sessionId: string, metrics: SessionMetrics): Promise<void> {
    // TODO: Backend Integration Point
    void sessionId;
    void metrics;
  },

  /**
   * Get current recording state.
   * TODO: Backend API — GET /session/:id/state
   */
  async getRecordingState(sessionId: string): Promise<RecordingState> {
    // TODO: Backend Integration Point
    void sessionId;
    return 'idle';
  },

  /**
   * Get previous sessions for athlete.
   * TODO: Backend API — GET /session/athlete/:athleteId
   */
  async getSessions(athleteId: string): Promise<SessionData[]> {
    // TODO: Backend Integration Point
    void athleteId;
    return [];
  },
};
