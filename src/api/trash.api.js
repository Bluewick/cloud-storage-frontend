import apiClient from './apiClient';

export const trashApi = {
  getTrash: () => apiClient.get('/api/trash'),
  restoreItem: ({ resourceType, resourceId }) =>
    apiClient.patch('/api/trash/restore', { resourceType, resourceId }),
  purgeItem: ({ resourceType, resourceId }) =>
    apiClient.delete('/api/trash/purge', { data: { resourceType, resourceId } }),
  emptyTrash: () => apiClient.post('/api/trash/empty'),
};