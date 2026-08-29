import apiClient from './apiClient';

export const usersApi = {
  getMe: () => apiClient.get('/api/users/me'),
  updateMe: (data) => apiClient.patch('/api/users/me', data),
  getStorageUsage: () => apiClient.get('/api/users/me/storage'),
};