import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatBytes } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { UserProfileCard } from './UserProfileCard';
import {
  Cloud,
  HardDrive,
  Users,
  Clock,
  Star,
  Trash2,
  Settings,
  Plus,
  Zap,
} from 'lucide-react';

const mainNavigation = [
  { name: 'My Drive', path: '/drive', icon: HardDrive },
  { name: 'Shared with me', path: '/shared-with-me', icon: Users },
  { name: 'Recent', path: '/recents', icon: Clock },
  { name: 'Starred', path: '/starred', icon: Star },
];

const systemNavigation = [
  { name: 'Trash', path: '/trash', icon: Trash2 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ onOpenNewFolder, onOpenUpload, onCloseMobile }) {
  const { storage } = useAuth();

  const usedBytes = storage?.storageUsedBytes || 0;
  const limitBytes = storage?.storageLimitBytes || 5368709120;
  const usagePct = limitBytes > 0 ? (usedBytes / limitBytes) * 100 : 0;

  return (
    <aside className="w-64 h-full bg-white border-r border-outline flex flex-col justify-between select-none">
      {/* Top Section: Logo & Main Navigation */}
      <div className="p-4 flex flex-col gap-5 overflow-y-auto">
        {/* Brand Header */}
        <Link
          to="/drive"
          onClick={onCloseMobile}
          className="flex items-center gap-2 px-2 py-1 text-on-surface hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-md bg-primary border-none flex items-center justify-center text-white shadow-sm">
            <Cloud size={18} />
          </div>
          <div className='flex flex-col align-center justify-center'>
            <h1 className="text-sm text-primary font-bold tracking-tight flex items-center gap-1">
              Stream Drive
            </h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400">
              Cloud Workspace
            </span>
          </div>
        </Link>

        {/* Quick Action Button */}
        <div className="px-1">
          <button
            type="button"
            onClick={() => onOpenUpload && onOpenUpload()}
            className="w-full h-10 bg-primary hover:bg-primary-hover cursor-pointer text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Upload File</span>
          </button>
        </div>

        {/* Navigation Group 1: Main */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider mb-1">
            Main Navigation
          </span>
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `h-9 px-3 rounded-lg flex items-center gap-3 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-container text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-dim hover:text-on-surface'
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Navigation Group 2: System */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider mb-1">
            Workspace & System
          </span>
          {systemNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `h-9 px-3 rounded-lg flex items-center gap-3 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-container text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-dim hover:text-on-surface'
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Storage Quota & User Card */}
      <div className="p-4 border-t border-outline flex flex-col gap-3.5 bg-surface/30">
        {/* Storage Quota Widget */}
        <div className="p-3 bg-white border border-outline rounded-xl shadow-level-1 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-on-surface flex items-center gap-1.5">
              <HardDrive size={13} className="text-primary" />
              Storage
            </span>
            <span className="text-[11px] text-on-surface-muted font-medium">
              {Math.round(usagePct)}%
            </span>
          </div>

          <ProgressBar value={usedBytes} max={limitBytes} size="sm" color="auto" />

          <p className="text-[11px] text-on-surface-variant">
            {formatBytes(usedBytes)} of {formatBytes(limitBytes)} used
          </p>
        </div>

        {/* User Card */}
        <UserProfileCard />
      </div>
    </aside>
  );
}