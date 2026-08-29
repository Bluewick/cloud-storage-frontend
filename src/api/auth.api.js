import apiClient from './apiClient';

export const authApi = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
};