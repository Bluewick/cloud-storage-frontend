import React, { useState, useEffect } from 'react';
import { searchApi } from '../api/search.api';
import { foldersApi } from '../api/folders.api';
import { filesApi } from '../api/files.api';
import { useExplorer } from '../context/ExplorerContext';
import { FolderCard } from '../components/explorer/FolderCard';
import { FileCard } from '../components/explorer/FileCard';
import { RenameModal } from '../components/modals/RenameModal';
import { MoveResourceModal } from '../components/modals/MoveResourceModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { ShareModal } from '../components/modals/ShareModal';
import { GridCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Star } from 'lucide-react';

export function StarredPage() {
  const [data, setData] = useState({ folders: [], files: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { activeModal, openModal, closeModal } = useExplorer();

  const loadStarred = async () => {
    setIsLoading(true);
    try {
      const res = await searchApi.getStarred();
      if (res?.data) {
        setData({
          folders: res.data.folders || [],
          files: res.data.files || [],
        });
      }
    } catch (err) {
      console.error('Failed to load starred items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStarred();
  }, []);

  const handleUnstarFolder = async (folder) => {
    await foldersApi.starFolder(folder.id);
    loadStarred();
  };

  const handleUnstarFile = async (file) => {
    await filesApi.starFile(file.id);
    loadStarred();
  };

  const isEmpty = !isLoading && data.folders.length === 0 && data.files.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
          <Star size={22} className="text-amber-500 fill-amber-500" />
          Starred
        </h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Quickly access your most important favorited files and folders.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GridCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isEmpty && (
        <EmptyState
          icon={<Star size={36} className="text-amber-400" />}
          title="No starred items"
          description="Star items to keep them readily accessible here."
        />
      )}

      {!isLoading && !isEmpty && (
        <div className="space-y-6">
          {data.folders.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted mb-3">
                Folders ({data.folders.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={{ ...folder, is_starred: true }}
                    onStar={handleUnstarFolder}
                    onRename={(item) => openModal('rename', item, 'folder')}
                    onMove={(item) => openModal('move', item, 'folder')}
                    onShare={(item) => openModal('share', item, 'folder')}
                    onDelete={(item) => openModal('delete', item, 'folder')}
                  />
                ))}
              </div>
            </div>
          )}

          {data.files.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted mb-3">
                Files ({data.files.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={{ ...file, is_starred: true }}
                    onStar={handleUnstarFile}
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

      {/* Feature Modals */}
      <RenameModal
        isOpen={activeModal.type === 'rename'}
        onClose={closeModal}
        item={activeModal.item}
        resourceType={activeModal.resourceType}
        onSuccess={loadStarred}
      />

      <MoveResourceModal
        isOpen={activeModal.type === 'move'}
        onClose={closeModal}
        item={activeModal.item}
        resourceType={activeModal.resourceType}
        onSuccess={loadStarred}
      />

      <DeleteConfirmModal
        isOpen={activeModal.type === 'delete'}
        onClose={closeModal}
        item={activeModal.item}
        resourceType={activeModal.resourceType}
        onSuccess={loadStarred}
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