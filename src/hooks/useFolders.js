import { useState, useCallback } from 'react';
import { foldersApi } from '../api/folders.api';

export function useFolders() {
  const [tree, setTree] = useState([]);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  const fetchTree = useCallback(async () => {
    setIsLoadingTree(true);
    try {
      const res = await foldersApi.getHierarchyTree();
      if (res?.data) {
        setTree(res.data);
      }
    } catch (err) {
      console.error('Failed to load folder tree:', err);
    } finally {
      setIsLoadingTree(false);
    }
  }, []);

  const createFolder = async (name, parentId = null) => {
    return await foldersApi.createFolder({ name, parentId });
  };

  const renameFolder = async (folderId, newName) => {
    return await foldersApi.renameFolder(folderId, newName);
  };

  const moveFolder = async (folderId, destinationParentId) => {
    return await foldersApi.moveFolder(folderId, destinationParentId);
  };

  const toggleStarFolder = async (folderId) => {
    return await foldersApi.starFolder(folderId);
  };

  const deleteFolder = async (folderId) => {
    return await foldersApi.deleteFolder(folderId);
  };

  return {
    tree,
    isLoadingTree,
    fetchTree,
    createFolder,
    renameFolder,
    moveFolder,
    toggleStarFolder,
    deleteFolder,
  };
}