// ============================================================
// NDURANCE — Report Service
// TODO: Backend API — connect all methods to real endpoints
// ============================================================

import type { ReportData } from '../types/session.types';

// TODO: Backend Integration Point — import apiInstance
// import { apiInstance } from '../api/axiosInstance';

export const reportService = {
  /**
   * Generate report for a session.
   * TODO: Backend API — POST /report/generate/:sessionId
   */
  async generateReport(sessionId: string): Promise<ReportData> {
    // TODO: Backend Integration Point
    void sessionId;
    throw new Error('TODO: Backend API — generateReport not connected');
  },

  /**
   * Fetch existing report.
   * TODO: Backend API — GET /report/:sessionId
   */
  async getReport(sessionId: string): Promise<ReportData> {
    // TODO: Backend Integration Point
    void sessionId;
    throw new Error('TODO: Backend API — getReport not connected');
  },

  /**
   * Export report as PDF.
   * TODO: Backend API — GET /report/:sessionId/pdf
   */
  async exportPDF(sessionId: string): Promise<Blob> {
    // TODO: Backend Integration Point
    // const response = await apiInstance.request<Blob>('GET', `/report/${sessionId}/pdf`);
    // Fallback: browser print
    void sessionId;
    window.print();
    return new Blob();
  },
};
