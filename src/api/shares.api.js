import apiClient from './apiClient';

export const sharesApi = {
  shareResource: ({ resourceType, resourceId, email, permission }) =>
    apiClient.post('/api/shares', { resourceType, resourceId, email, permission }),
  getCollaborators: (resourceType, resourceId) =>
    apiClient.get('/api/shares/collaborators', { params: { resourceType, resourceId } }),
  getSharedWithMe: () => apiClient.get('/api/shares/shared-with-me'),
  updateCollaboratorPermission: (shareId, permission) =>
    apiClient.patch(`/api/shares/${shareId}`, { permission }),
  revokeAccess: (shareId) => apiClient.delete(`/api/shares/${shareId}`),
};