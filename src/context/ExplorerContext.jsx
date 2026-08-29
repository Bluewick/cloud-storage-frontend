import React, { createContext, useContext, useState, useCallback } from 'react';
import { foldersApi } from '../api/folders.api';

const ExplorerContext = createContext(null);

export function ExplorerProvider({ children }) {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState({ key: 'name', order: 'asc' }); // key: 'name' | 'updatedAt' | 'sizeBytes'

  // Modal State Triggers
  const [activeModal, setActiveModal] = useState({
    type: null, // 'create-folder' | 'rename' | 'move' | 'delete' | 'share'
    item: null, // target item (file or folder)
    resourceType: null, // 'file' | 'folder'
  });

  const openModal = (type, item = null, resourceType = null) => {
    setActiveModal({ type, item, resourceType });
  };

  const closeModal = () => {
    setActiveModal({ type: null, item: null, resourceType: null });
  };

  // Fetch Folder Contents (Root or Subfolder)
  const fetchContents = useCallback(async (folderId = null) => {
    setIsLoading(true);
    try {
      const res = folderId
        ? await foldersApi.getFolderContents(folderId)
        : await foldersApi.getRootContents();

      if (res?.data) {
        setCurrentFolder(res.data.currentFolder || null);
        setBreadcrumbs(res.data.breadcrumbs || []);
        setFolders(res.data.folders || []);
        setFiles(res.data.files || []);
      }
    } catch (err) {
      console.error('Failed to load drive contents:', err);
    } finally {
      setIsLoading(false);
    } 
  }, []);

  return (
    <ExplorerContext.Provider
      value={{
        currentFolder,
        breadcrumbs,
        folders,
        files,
        isLoading,
        viewMode,
        sortBy,
        activeModal,
        setViewMode,
        setSortBy,
        fetchContents,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
}

export function useExplorer() {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error('useExplorer must be used within an ExplorerProvider');
  }
  return context;
}