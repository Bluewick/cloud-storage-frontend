import React from 'react';
import { getFileIcon } from '../../utils/fileIcons';
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

export function FileCard({
  file,
  onStar,
  onRename,
  onMove,
  onShare,
  onDelete,
}) {
  const handleDownload = async () => {
    try {
      const res = await filesApi.getDownloadUrl(file.id);
      if (res?.data?.downloadUrl) {
        window.open(res.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to download file:', err);
    }
  };

  const thumbUrl = file.thumbnailUrl || file.thumbnail_url;

  return (
    <div className="group relative bg-white border border-outline hover:border-primary/40 rounded-xl p-3 flex flex-col justify-between h-48 shadow-level-1 hover:shadow-md transition-all select-none">
      {/* Top Row: Thumbnail or Icon & Header Actions */}
      <div className="relative w-full">
        {thumbUrl ? (
          <div className="w-full h-24 rounded-lg overflow-hidden bg-surface-dim border border-outline relative">
            <img
              src={thumbUrl}
              alt={file.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
            <div className="hidden w-full h-full items-center justify-center bg-surface-dim">
              {getFileIcon(file.extension, file.mime_type || file.mimeType, 28)}
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-surface-dim border border-outline shrink-0">
              {getFileIcon(file.extension, file.mime_type || file.mimeType, 24)}
            </div>
          </div>
        )}

        <div
          className={`flex items-center gap-1 ${
            thumbUrl
              ? 'absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm rounded-lg p-0.5 shadow-sm'
              : 'absolute top-0 right-0'
          }`}
        >
          {/* Star Button */}
          <button
            type="button"
            onClick={() => onStar(file)}
            className={`p-1.5 rounded-lg hover:bg-surface-dim transition-colors ${
              file.is_starred || file.isStarred ? 'text-amber-500' : 'text-on-surface-muted opacity-0 group-hover:opacity-100'
            }`}
          >
            <Star
              size={14}
              className={file.is_starred || file.isStarred ? 'fill-amber-500 text-amber-500' : ''}
            />
          </button>

          {/* Context Menu */}
          <DropdownMenu
            trigger={
              <button
                type="button"
                className="p-1.5 cursor-pointer text-on-surface-muted hover:text-on-surface hover:bg-surface-dim rounded-lg"
              >
                <MoreVertical size={14} />
              </button>
            }
          >
            <DropdownItem icon={<Download size={14} />} onClick={handleDownload}>
              Download
            </DropdownItem>
            <DropdownItem icon={<Share2 size={14} />} onClick={() => onShare(file)}>
              Share
            </DropdownItem>
            <DropdownItem icon={<Edit2 size={14} />} onClick={() => onRename(file)}>
              Rename
            </DropdownItem>
            <DropdownItem icon={<FolderInput size={14} />} onClick={() => onMove(file)}>
              Move
            </DropdownItem>
            <DropdownItem
              icon={<Star size={14} className="text-amber-500" />}
              onClick={() => onStar(file)}
            >
              {file.is_starred || file.isStarred ? 'Remove from Starred' : 'Add to Starred'}
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={() => onDelete(file)}
            >
              Move to Trash
            </DropdownItem>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
          {file.name}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-on-surface-muted mt-1">
          <span>{formatBytes(file.size_bytes || file.sizeBytes)}</span>
          <span>{formatDate(file.updated_at || file.updatedAt || file.created_at || file.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}