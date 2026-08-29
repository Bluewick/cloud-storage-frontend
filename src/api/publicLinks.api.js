import apiClient from './apiClient';
import { API_URL } from '../utils/constants';
import axios from 'axios';

export const publicLinksApi = {
  createPublicLink: ({ resourceType, resourceId, permission, password, expiresAt }) =>
    apiClient.post('/api/public-links', { resourceType, resourceId, permission, password, expiresAt }),
  
  getPublicLinkStatus: (resourceType, resourceId) =>
    apiClient.get('/api/public-links/status', { params: { resourceType, resourceId } }),
  
  deletePublicLink: (resourceType, resourceId) =>
    apiClient.delete('/api/public-links', { data: { resourceType, resourceId } }),

  // Public unauthenticated routes
  viewPublicResource: (token, password = '', folderId = null) => {
    return axios.get(`${API_URL}/api/public-links/view/${token}`, {
      headers: password ? { 'x-link-password': password } : {},
      params: folderId ? { folderId } : {},
    }).then(res => res.data);
  },

  downloadPublicResource: (token, password = '', fileId = null) => {
    return axios.get(`${API_URL}/api/public-links/download/${token}`, {
      headers: password ? { 'x-link-password': password } : {},
      params: fileId ? { fileId } : {},
    }).then(res => res.data);
  },
};