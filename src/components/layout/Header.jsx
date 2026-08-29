import React from 'react';
import { Search, Plus, FolderPlus, Upload, Menu } from 'lucide-react';
import { Button } from '../common/Button';
import { DropdownMenu, DropdownItem } from '../common/DropdownMenu';

export function Header({
  onOpenCommandPalette,
  onOpenNewFolder,
  onOpenUpload,
  onToggleMobileSidebar,
}) {
  return (
    <header className="h-16 bg-white border-b border-outline px-6 flex items-center justify-between gap-4 select-none shrink-0">
      {/* Left: Mobile Toggle & Quick Search Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-dim rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar (Trigger for ⌘K) */}
        <div
          onClick={onOpenCommandPalette}
          className="w-full h-9 bg-surface-dim hover:bg-surface-container-high border border-outline rounded-xl px-3 flex items-center justify-between cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-2.5 text-on-surface-muted group-hover:text-on-surface-variant">
            <Search size={15} />
            <span className="text-xs">Search files, folders...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-muted bg-white border border-outline rounded shadow-sm">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <DropdownMenu
          trigger={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus size={16} />}
              className="font-semibold shadow-sm"
            >
              <span>New</span>
            </Button>
          }
        >
          <DropdownItem
            icon={<Upload size={15} className="text-primary" />}
            onClick={onOpenUpload}
          >
            Upload File
          </DropdownItem>
          <DropdownItem
            icon={<FolderPlus size={15} className="text-amber-500" />}
            onClick={onOpenNewFolder}
          >
            New Folder
          </DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
}