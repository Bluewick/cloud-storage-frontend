import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { filesApi } from '../api/files.api';
import { useAuth } from './AuthContext';

const UploadContext = createContext(null);

export function UploadProvider({ children }) {
  const [uploads, setUploads] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { refreshStorage } = useAuth();
  const abortControllers = useRef(new Map());

  // Update specific upload state
  const updateUploadState = (id, updates) => {
    setUploads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Execute 3-step upload flow for a single file
  const processSingleUpload = async (uploadTask) => {
    const { id, file, folderId } = uploadTask;
    const controller = new AbortController();
    abortControllers.current.set(id, controller);

    try {
      // Step 1: Request Presigned Upload URL from backend
      updateUploadState(id, { status: 'getting-url', progress: 5 });
      const presignedRes = await filesApi.getUploadUrl({
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        folderId: folderId || null,
      });

      const { fileId, storagePath, signedUploadUrl } = presignedRes.data;

      // Step 2: Directly upload binary to Supabase Storage via signed URL
      updateUploadState(id, { status: 'uploading', progress: 10, fileId });
      
      await axios.put(signedUploadUrl, file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 80) / progressEvent.total) + 10;
            updateUploadState(id, { progress: Math.min(percent, 90) });
          }
        },
      });

      // Step 3: Confirm upload & save metadata in backend
      updateUploadState(id, { status: 'confirming', progress: 95 });
      const extension = file.name.split('.').pop() || '';
      
      await filesApi.confirmUpload({
        fileId,
        name: file.name,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        extension,
        sizeBytes: file.size,
        storagePath,
        folderId: folderId || null,
      });

      // Mark Complete
      updateUploadState(id, { status: 'completed', progress: 100 });
      refreshStorage();
    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError') {
        updateUploadState(id, { status: 'canceled', error: 'Upload canceled' });
      } else {
        console.error('Upload process failed:', err);
        updateUploadState(id, {
          status: 'error',
          error: err.message || 'Failed to complete file upload',
        });
      }
    } finally {
      abortControllers.current.delete(id);
    }
  };

  // Upload multiple files
  const uploadFiles = useCallback((fileList, folderId = null) => {
    if (!fileList || fileList.length === 0) return;

    const newTasks = Array.from(fileList).map((file) => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      folderId,
      progress: 0,
      status: 'pending', // 'pending' | 'getting-url' | 'uploading' | 'confirming' | 'completed' | 'error' | 'canceled'
      error: null,
    }));

    setUploads((prev) => [...newTasks, ...prev]);
    setIsDrawerOpen(true);

    // Start uploads asynchronously
    newTasks.forEach((task) => processSingleUpload(task));
  }, [refreshStorage]);

  // Cancel in-progress upload
  const cancelUpload = (id) => {
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
    }
    updateUploadState(id, { status: 'canceled', error: 'Upload canceled' });
  };

  // Retry failed upload
  const retryUpload = (id) => {
    const task = uploads.find((u) => u.id === id);
    if (task) {
      updateUploadState(id, { status: 'pending', progress: 0, error: null });
      processSingleUpload(task);
    }
  };

  // Clear completed/canceled tasks from list
  const clearCompleted = () => {
    setUploads((prev) => prev.filter((u) => u.status !== 'completed' && u.status !== 'canceled'));
  };

  return (
    <UploadContext.Provider
      value={{
        uploads,
        isDrawerOpen,
        setIsDrawerOpen,
        uploadFiles,
        cancelUpload,
        retryUpload,
        clearCompleted,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}