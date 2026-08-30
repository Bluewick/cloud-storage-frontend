import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFolderIcon } from '../../utils/fileIcons';
import { DropdownMenu, DropdownItem, DropdownDivider } from '../common/DropdownMenu';
import { 
  MoreVertical, 
  Star, 
  Edit2, 
  FolderInput, 
  Share2, 
  Trash2 
} from 'lucide-react';

export function FolderCard({
  folder,
  onStar,
  onRename,
  onMove,
  onShare,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div
      onDoubleClick={() => navigate(`/drive/${folder.id}`)}
      className="group relative bg-white border border-outline hover:border-primary/40 rounded-xl p-3.5 flex items-center justify-between shadow-level-1 hover:shadow-md transition-all cursor-pointer select-none"
    >
      {/* Folder Icon & Name */}
      <div
        onClick={() => navigate(`/drive/${folder.id}`)}
        className="flex cursor-pointer items-center gap-3 truncate flex-1 pr-2"
      >
        <div className="p-2 rounded-lg bg-blue-50/50 group-hover:bg-blue-50 transition-colors shrink-0">
          {getFolderIcon(20, folder.is_starred || folder.isStarred)}
        </div>
        <span className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
          {folder.name}
        </span>
      </div>

      {/* Action Strip */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Star Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStar(folder);
          }}
          className={`p-1.5 cursor-pointer rounded-lg hover:bg-surface-dim transition-colors ${
            folder.is_starred || folder.isStarred ? 'text-amber-500 opacity-100' : 'text-on-surface-muted'
          }`}
        >
          <Star
            size={14}
            className={folder.is_starred || folder.isStarred ? 'fill-amber-500 text-amber-500' : ''}
          />
        </button>

        {/* Context Menu */}
        <div onClick={(e) => e.stopPropagation()}>
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
            <DropdownItem icon={<Share2 size={14} />} onClick={() => onShare(folder)}>
              Share
            </DropdownItem>
            <DropdownItem icon={<Edit2 size={14} />} onClick={() => onRename(folder)}>
              Rename
            </DropdownItem>
            <DropdownItem icon={<FolderInput size={14} />} onClick={() => onMove(folder)}>
              Move
            </DropdownItem>
            <DropdownItem
              icon={<Star size={14} className="text-amber-500" />}
              onClick={() => onStar(folder)}
            >
              {folder.is_starred || folder.isStarred ? 'Remove from Starred' : 'Add to Starred'}
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={() => onDelete(folder)}
            >
              Move to Trash
            </DropdownItem>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}