import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { 
  ChevronUp, 
  User, 
  Settings, 
  HardDrive, 
  LogOut, 
  Sparkles 
} from 'lucide-react';

export function UserProfileCard() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close flyout on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="relative w-full" ref={menuRef}>
      {/* Floating Level 2 Flyout Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl border border-outline shadow-level-2 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Header Row */}
          <div className="flex items-center justify-between px-2.5 py-2">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-on-surface truncate">{user.fullName}</p>
              <p className="text-[11px] text-on-surface-muted truncate">{user.email}</p>
            </div>
            <Badge variant="success" size="sm" className="font-semibold">
              PRO
            </Badge>
          </div>

          <div className="h-px bg-outline my-1.5" />

          {/* Links */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate('/settings');
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-dim rounded-lg transition-colors text-left"
          >
            <Settings size={15} className="text-on-surface-muted" />
            <span>Account Settings</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate('/settings');
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-dim rounded-lg transition-colors text-left"
          >
            <HardDrive size={15} className="text-on-surface-muted" />
            <span>Storage & Plan</span>
          </button>

          <div className="h-px bg-outline my-1.5" />

          {/* Destructive Action */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-accent-error hover:bg-accent-error-container hover:text-accent-error-on rounded-lg transition-colors text-left"
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      )}

      {/* Collapsed Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-surface-dim border border-transparent hover:border-outline transition-all duration-150 text-left group"
      >
        <div className="flex items-center gap-2.5 truncate">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-8 h-8 rounded-lg object-cover border border-outline shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-sm">
              {initials}
            </div>
          )}
          <div className="truncate">
            <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
              {user.fullName}
            </p>
            <p className="text-[11px] text-on-surface-muted truncate">{user.email}</p>
          </div>
        </div>

        <ChevronUp
          size={16}
          className={`text-on-surface-muted transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>
    </div>
  );
}