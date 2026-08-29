import apiClient from './apiClient';
import axios from 'axios';

export const filesApi = {
  // Step 1: Request presigned upload URL from backend
  getUploadUrl: ({ fileName, mimeType, sizeBytes, folderId }) =>
    apiClient.post('/api/files/upload-url', { fileName, mimeType, sizeBytes, folderId }),

  // Step 2: Directly upload binary data to Supabase Storage via signed URL
  uploadToSignedUrl: (signedUploadUrl, file, onUploadProgress) => {
    return axios.put(signedUploadUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      onUploadProgress,
    });
  },

  // Step 3: Confirm file metadata in backend
  confirmUpload: (data) => apiClient.post('/api/files/confirm-upload', data),

  // File metadata and operations
  getFileMetadata: (fileId) => apiClient.get(`/api/files/${fileId}`),
  getDownloadUrl: (fileId) => apiClient.get(`/api/files/${fileId}/download`),
  renameFile: (fileId, name) => apiClient.patch(`/api/files/${fileId}/rename`, { name }),
  moveFile: (fileId, destinationFolderId) => apiClient.patch(`/api/files/${fileId}/move`, { destinationFolderId }),
  starFile: (fileId) => apiClient.patch(`/api/files/${fileId}/star`),
  deleteFile: (fileId) => apiClient.delete(`/api/files/${fileId}`),
};