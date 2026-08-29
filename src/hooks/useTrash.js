import { useState, useCallback } from 'react';
import { trashApi } from '../api/trash.api';

export function useTrash() {
  const [trashData, setTrashData] = useState({ folders: [], files: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTrash = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await trashApi.getTrash();
      if (res?.data) {
        setTrashData({
          folders: res.data.folders || [],
          files: res.data.files || [],
        });
      }
    } catch (err) {
      console.error('Failed to load trash:', err);
      setError(err.message || 'Failed to load trash items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restoreItem = async (resourceType, resourceId) => {
    await trashApi.restoreItem({ resourceType, resourceId });
    await loadTrash();
  };

  const purgeItem = async (resourceType, resourceId) => {
    await trashApi.purgeItem({ resourceType, resourceId });
    await loadTrash();
  };

  const emptyTrash = async () => {
    await trashApi.emptyTrash();
    await loadTrash();
  };

  return {
    trashData,
    isLoading,
    error,
    loadTrash,
    restoreItem,
    purgeItem,
    emptyTrash,
  };
}