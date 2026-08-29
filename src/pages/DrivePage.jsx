import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useExplorer } from '../context/ExplorerContext';
import { useFolders } from '../hooks/useFolders';
import { filesApi } from '../api/files.api';
import { useAuth } from '../context/AuthContext';
import { ExplorerToolbar } from '../components/explorer/ExplorerToolbar';
import { FolderCard } from '../components/explorer/FolderCard';
import { FileCard } from '../components/explorer/FileCard';
import { ExplorerTable } from '../components/explorer/ExplorerTable';
import { CreateFolderModal } from '../components/modals/CreateFolderModal';
import { RenameModal } from '../components/modals/RenameModal';
import { MoveResourceModal } from '../components/modals/MoveResourceModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { ShareModal } from '../components/modals/ShareModal';
import { GridCardSkeleton, TableRowSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { FolderPlus, Upload, FolderOpen } from 'lucide-react';

export function DrivePage({ onOpenUpload }) {
  const { folderId } = useParams();
  const { refreshStorage } = useAuth();
  const {
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
  } = useExplorer();

  const { toggleStarFolder } = useFolders();

  useEffect(() => {
    fetchContents(folderId || null);
  }, [folderId, fetchContents]);

  // Star Handlers
  const handleStarFolder = async (folder) => {
    try {
      await toggleStarFolder(folder.id);
      fetchContents(folderId || null);
    } catch (err) {
      console.error('Failed to star folder:', err);
    }
  };

  const handleStarFile = async (file) => {
    try {
      await filesApi.starFile(file.id);
      fetchContents(folderId || null);
    } catch (err) {
      console.error('Failed to star file:', err);
    }
  };

  const isEmpty = !isLoading && folders.length === 0 && files.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <ExplorerToolbar
        breadcrumbs={breadcrumbs}
        viewMode={viewMode}
        sortBy={sortBy}
        onViewModeChange={setViewMode}
        onSortChange={(key) =>
          setSortBy((prev) => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
          }))
        }
        onOpenNewFolder={() => openModal('create-folder')}
        onOpenUpload={onOpenUpload}
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <GridCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-outline">
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <EmptyState
          icon={<FolderOpen size={40} className="text-primary" />}
          title="This folder is empty"
          description="Drop files here or use the buttons below to create folders and upload files."
          action={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openModal('create-folder')}
                leftIcon={<FolderPlus size={14} />}
              >
                New Folder
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenUpload}
                leftIcon={<Upload size={14} />}
              >
                Upload File
              </Button>
            </div>
          }
        />
      )}

      {/* Content Display: Grid Mode */}
      {!isLoading && !isEmpty && viewMode === 'grid' && (
        <div className="space-y-6">
          {/* Folders Grid */}
          {folders.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted mb-3">
                Folders ({folders.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onStar={handleStarFolder}
                    onRename={(item) => openModal('rename', item, 'folder')}
                    onMove={(item) => openModal('move', item, 'folder')}
                    onShare={(item) => openModal('share', item, 'folder')}
                    onDelete={(item) => openModal('delete', item, 'folder')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Files Grid */}
          {files.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted mb-3">
                Files ({files.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onStar={handleStarFile}
                    onRename={(item) => openModal('rename', item, 'file')}
                    onMove={(item) => openModal('move', item, 'file')}
                    onShare={(item) => openModal('share', item, 'file')}
                    onDelete={(item) => openModal('delete', item, 'file')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Display: List Mode */}
      {!isLoading && !isEmpty && viewMode === 'list' && (
        <ExplorerTable
          folders={folders}
          files={files}
          onStarFolder={handleStarFolder}
          onStarFile={handleStarFile}
          onRename={(item, type) => openModal('rename', item, type)}
          onMove={(item, type) => openModal('move', item, type)}
          onShare={(item, type) => openModal('share', item, type)}
          onDelete={(item, type) => openModal('delete', item, type)}
        />
      )}

      {/* Feature Modals */}
      <CreateFolderModal
        isOpen={activeModal.type === 'create-folder'}
        onClose={closeModal}
        currentFolderId={folderId || null}
        onSuccess={() => fetchContents(folderId || null)}
      />

      <RenameModal
        isOpen={activeModal.type === 'rename'}
        onClose={closeModal}
        item={activeModal.item}
        resourceType={activeModal.resourceType}
        onSuccess={() => fetchContents(folderId || null)}
      />

      <MoveResourceModal
        isOpen={activeModal.type === 'move'}
        onClose={closeModal}
        item={activeModal.item}
        resourceType={activeModal.resourceType}
        onSuccess={() => fetchContents(folderId || null)}
      />

      <DeleteConfirmModal
        isOpen={activeModal.type === 'delete'}
        onClose={closeModal}
        item={activeModal.item}
        resourceType={activeModal.resourceType}
        onSuccess={() => {
          fetchContents(folderId || null);
          refreshStorage();
        }}
      />

      <ShareModal
        isOpen={activeModal.type === 'share'}
        onClose={closeModal}
        item={activeModal.item}
        resourceType={activeModal.resourceType}
      />
    </div>
  );
}