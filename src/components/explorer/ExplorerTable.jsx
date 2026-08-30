import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFileIcon, getFolderIcon } from '../../utils/fileIcons';
import { formatBytes, formatDate } from '../../utils/formatters';
import { DropdownMenu, DropdownItem, DropdownDivider } from '../common/DropdownMenu';
import { filesApi } from '../../api/files.api';
import {
  MoreVertical,
  Star,
  Download,
  Edit2,
  FolderInput,
  Share2,
  Trash2,
} from 'lucide-react';

export function ExplorerTable({
  folders = [],
  files = [],
  onStarFolder,
  onStarFile,
  onRename,
  onMove,
  onShare,
  onDelete,
}) {
  const navigate = useNavigate();

  const handleDownload = async (file) => {
    try {
      const res = await filesApi.getDownloadUrl(file.id);
      if (res?.data?.downloadUrl) {
        window.open(res.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-outline shadow-level-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="h-9 border-b border-outline bg-surface-dim/50 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            <th className="py-2 px-4 w-8"></th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4 w-32">Size</th>
            <th className="py-2 px-4 w-40">Last Modified</th>
            <th className="py-2 px-4 w-12 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-dim text-xs">
          {/* Folders */}
          {folders.map((folder) => {
            const isStarred = folder.is_starred || folder.isStarred;
            return (
              <tr
                key={folder.id}
                onDoubleClick={() => navigate(`/drive/${folder.id}`)}
                className="h-12 hover:bg-surface-dim transition-colors group cursor-pointer"
              >
                <td className="py-2 px-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarFolder(folder);
                    }}
                    className={`text-on-surface-muted hover:text-amber-500 ${
                      isStarred ? 'text-amber-500' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star size={14} className={isStarred ? 'fill-amber-500' : ''} />
                  </button>
                </td>
                <td className="py-2 px-4 font-medium text-on-surface">
                  <div className="flex items-center gap-2.5 truncate">
                    {getFolderIcon(18, isStarred)}
                    <span className="truncate group-hover:text-primary transition-colors">
                      {folder.name}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-4 text-on-surface-muted">—</td>
                <td className="py-2 px-4 text-on-surface-muted">
                  {formatDate(folder.updated_at || folder.updatedAt || folder.created_at)}
                </td>
                <td className="py-2 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu
                    trigger={
                      <button className="p-1.5 text-on-surface-muted hover:text-on-surface rounded-lg">
                        <MoreVertical size={15} />
                      </button>
                    }
                  >
                    <DropdownItem icon={<Share2 size={14} />} onClick={() => onShare(folder, 'folder')}>
                      Share
                    </DropdownItem>
                    <DropdownItem icon={<Edit2 size={14} />} onClick={() => onRename(folder, 'folder')}>
                      Rename
                    </DropdownItem>
                    <DropdownItem icon={<FolderInput size={14} />} onClick={() => onMove(folder, 'folder')}>
                      Move
                    </DropdownItem>
                    <DropdownItem
                      icon={<Star size={14} className="text-amber-500" />}
                      onClick={() => onStarFolder(folder)}
                    >
                      {isStarred ? 'Unstar' : 'Star'}
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                      variant="destructive"
                      icon={<Trash2 size={14} />}
                      onClick={() => onDelete(folder, 'folder')}
                    >
                      Move to Trash
                    </DropdownItem>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}

          {/* Files */}
          {files.map((file) => {
            const isStarred = file.is_starred || file.isStarred;
            return (
              <tr
                key={file.id}
                className="h-12 hover:bg-surface-dim transition-colors group"
              >
                <td className="py-2 px-4">
                  <button
                    type="button"
                    onClick={() => onStarFile(file)}
                    className={`text-on-surface-muted hover:text-amber-500 ${
                      isStarred ? 'text-amber-500' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star size={14} className={isStarred ? 'fill-amber-500' : ''} />
                  </button>
                </td>
                <td className="py-2 px-4 font-medium text-on-surface">
                  <div className="flex items-center gap-2.5 truncate">
                    {file.thumbnailUrl || file.thumbnail_url ? (
                      <div className="w-7 h-7 rounded-md overflow-hidden bg-surface-dim border border-outline shrink-0">
                        <img
                          src={file.thumbnailUrl || file.thumbnail_url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center">
                          {getFileIcon(file.extension, file.mime_type || file.mimeType, 16)}
                        </div>
                      </div>
                    ) : (
                      getFileIcon(file.extension, file.mime_type || file.mimeType, 18)
                    )}
                    <span className="truncate group-hover:text-primary transition-colors">
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-4 text-on-surface-muted">
                  {formatBytes(file.size_bytes || file.sizeBytes)}
                </td>
                <td className="py-2 px-4 text-on-surface-muted">
                  {formatDate(file.updated_at || file.updatedAt || file.created_at)}
                </td>
                <td className="py-2 px-4 text-right">
                  <DropdownMenu
                    trigger={
                      <button className="p-1.5 text-on-surface-muted hover:text-on-surface rounded-lg">
                        <MoreVertical size={15} />
                      </button>
                    }
                  >
                    <DropdownItem icon={<Download size={14} />} onClick={() => handleDownload(file)}>
                      Download
                    </DropdownItem>
                    <DropdownItem icon={<Share2 size={14} />} onClick={() => onShare(file, 'file')}>
                      Share
                    </DropdownItem>
                    <DropdownItem icon={<Edit2 size={14} />} onClick={() => onRename(file, 'file')}>
                      Rename
                    </DropdownItem>
                    <DropdownItem icon={<FolderInput size={14} />} onClick={() => onMove(file, 'file')}>
                      Move
                    </DropdownItem>
                    <DropdownItem
                      icon={<Star size={14} className="text-amber-500" />}
                      onClick={() => onStarFile(file)}
                    >
                      {isStarred ? 'Unstar' : 'Star'}
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                      variant="destructive"
                      icon={<Trash2 size={14} />}
                      onClick={() => onDelete(file, 'file')}
                    >
                      Move to Trash
                    </DropdownItem>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}