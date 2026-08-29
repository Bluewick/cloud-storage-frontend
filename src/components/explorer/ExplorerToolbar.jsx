import React from 'react';
import { Breadcrumb } from '../common/Breadcrumb';
import { Button } from '../common/Button';
import { DropdownMenu, DropdownItem } from '../common/DropdownMenu';
import { 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  FolderPlus, 
  Upload 
} from 'lucide-react';

export function ExplorerToolbar({
  breadcrumbs,
  viewMode,
  sortBy,
  onViewModeChange,
  onSortChange,
  onOpenNewFolder,
  onOpenUpload,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline">
      {/* Left: Breadcrumbs */}
      <Breadcrumb items={breadcrumbs} rootLabel="My Drive" />

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Sort Dropdown */}
        <DropdownMenu
          trigger={
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowUpDown size={14} />}
              className="text-on-surface-variant text-xs"
            >
              <span>Sort</span>
            </Button>
          }
        >
          <DropdownItem
            onClick={() => onSortChange('name')}
            className={sortBy.key === 'name' ? 'font-semibold text-primary' : ''}
          >
            Name
          </DropdownItem>
          <DropdownItem
            onClick={() => onSortChange('updatedAt')}
            className={sortBy.key === 'updatedAt' ? 'font-semibold text-primary' : ''}
          >
            Last Modified
          </DropdownItem>
          <DropdownItem
            onClick={() => onSortChange('sizeBytes')}
            className={sortBy.key === 'sizeBytes' ? 'font-semibold text-primary' : ''}
          >
            File Size
          </DropdownItem>
        </DropdownMenu>

        {/* Segmented View Mode Toggle */}
        <div className="h-8 p-0.5 bg-surface-dim border border-outline rounded-lg flex items-center">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`h-7 px-2 rounded-md flex items-center justify-center transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-on-surface shadow-sm font-medium'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`h-7 px-2 rounded-md flex items-center justify-center transition-all ${
              viewMode === 'list'
                ? 'bg-white text-on-surface shadow-sm font-medium'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
            aria-label="List View"
          >
            <List size={15} />
          </button>
        </div>

        <div className="h-5 w-px bg-outline mx-1 hidden sm:block" />

        {/* Quick New Folder CTA */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenNewFolder}
          leftIcon={<FolderPlus size={14} className="text-amber-500" />}
          className="text-xs"
        >
          New Folder
        </Button>
      </div>
    </div>
  );
}