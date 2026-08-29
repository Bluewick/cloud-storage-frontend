import apiClient from './apiClient';

export const searchApi = {
  search: (params = {}) => apiClient.get('/api/search', { params }),
  getStarred: () => apiClient.get('/api/search/starred'),
  getRecents: () => apiClient.get('/api/search/recents'),
};