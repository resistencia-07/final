// ============================================================
// NDURANCE — Axios Instance
// All API calls go through this instance.
// TODO: Backend API — update baseURL when backend is ready
// ============================================================

// TODO: Backend Integration Point
// import axios from 'axios';
// Replace with real axios when installed:
// const api = axios.create({ baseURL: 'http://localhost:8000/api' });

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// TODO: Backend Integration Point — swap this mock with real axios instance
const createApiInstance = () => {
  // Placeholder for axios instance
  // When axios is installed:
  // return axios.create({
  //   baseURL: BASE_URL,
  //   timeout: 10000,
  //   headers: { 'Content-Type': 'application/json' },
  // });

  // Mock request helper until axios is installed
  const request = async <T>(
    _method: string,
    _url: string,
    _data?: unknown
  ): Promise<T> => {
    // TODO: Backend API — replace with real axios call
    throw new Error(`API not connected. Backend URL: ${BASE_URL}${_url}`);
  };

  return { request, BASE_URL };
};

export const apiInstance = createApiInstance();

// TODO: Backend Integration Point — Axios interceptors
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
//
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // TODO: refresh token logic
//     }
//     return Promise.reject(error);
//   }
// );

export default apiInstance;
