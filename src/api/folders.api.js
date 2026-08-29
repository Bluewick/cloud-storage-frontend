import apiClient from './apiClient';

export const foldersApi = {
  getRootContents: () => apiClient.get('/api/folders'),
  getFolderContents: (folderId) => apiClient.get(`/api/folders/${folderId}`),
  getHierarchyTree: () => apiClient.get('/api/folders/tree'),
  createFolder: ({ name, parentId = null }) => apiClient.post('/api/folders', { name, parentId }),
  renameFolder: (folderId, name) => apiClient.patch(`/api/folders/${folderId}/rename`, { name }),
  moveFolder: (folderId, destinationParentId) => apiClient.patch(`/api/folders/${folderId}/move`, { destinationParentId }),
  starFolder: (folderId) => apiClient.patch(`/api/folders/${folderId}/star`),
  deleteFolder: (folderId) => apiClient.delete(`/api/folders/${folderId}`),
};