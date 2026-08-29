import axios from 'axios';
import { API_URL, TOKEN_STORAGE_KEY } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling & session expiration
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 unauthorized
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    const customError = {
      status: error.response?.status,
      code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.error?.message || error.response?.data?.message || error.message || 'An unexpected error occurred',
      details: error.response?.data?.error?.details || [],
    };

    return Promise.reject(customError);
  }
);

export default apiClient;