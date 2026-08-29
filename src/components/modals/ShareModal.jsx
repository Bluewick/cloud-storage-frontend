import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { DropdownMenu, DropdownItem } from '../common/DropdownMenu';
import { useShares } from '../../hooks/useShares';
import { formatDate } from '../../utils/formatters';
import {
  Users,
  Link as LinkIcon,
  Copy,
  Check,
  Trash2,
  Lock,
  Calendar,
  UserPlus,
  Shield,
  ChevronDown,
  Loader2,
} from 'lucide-react';

export function ShareModal({ isOpen, onClose, item, resourceType = 'file' }) {
  const [activeTab, setActiveTab] = useState('collaborators'); // 'collaborators' | 'public-link'
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState('viewer');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // Public Link Settings
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [publicPermission, setPublicPermission] = useState('viewer');
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    collaboratorsData,
    publicLink,
    isLoading,
    loadCollaborators,
    loadPublicLink,
    inviteCollaborator,
    updatePermission,
    revokeCollaborator,
    createPublicLink,
    deletePublicLink,
  } = useShares();

  useEffect(() => {
    if (isOpen && item) {
      loadCollaborators(resourceType, item.id);
      loadPublicLink(resourceType, item.id);
      setInviteEmail('');
      setInviteError('');
      setCopied(false);
    }
  }, [isOpen, item, resourceType, loadCollaborators, loadPublicLink]);

  if (!item) return null;

  // Handle Invite Submit
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    setInviteError('');
    try {
      await inviteCollaborator({
        resourceType,
        resourceId: item.id,
        email: inviteEmail.trim(),
        permission: invitePermission,
      });
      setInviteEmail('');
    } catch (err) {
      setInviteError(err.message || 'Failed to share resource');
    } finally {
      setIsInviting(false);
    }
  };

  // Handle Generate Public Link
  const handleCreateLink = async () => {
    setIsCreatingLink(true);
    try {
      await createPublicLink({
        resourceType,
        resourceId: item.id,
        permission: publicPermission,
        password: isPasswordProtected ? password : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
    } catch (err) {
      console.error('Failed to create public link:', err);
    } finally {
      setIsCreatingLink(false);
    }
  };

  // Copy link to clipboard
  const fullShareUrl = publicLink ? `${window.location.origin}/s/${publicLink.token}` : '';
  const handleCopyLink = () => {
    if (fullShareUrl) {
      navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share "${item.name}"`}
      description="Manage collaborator permissions or generate a public share link."
      size="lg"
      footer={
        <Button variant="ghost" onClick={onClose}>
          Done
        </Button>
      }
    >
      {/* Segmented Tab Headers */}
      <div className="flex items-center gap-1 p-1 bg-surface-dim border border-outline rounded-xl mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('collaborators')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'collaborators'
              ? 'bg-white text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Users size={14} />
          <span>Collaborators ({collaboratorsData.collaborators.length + 1})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('public-link')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'public-link'
              ? 'bg-white text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <LinkIcon size={14} />
          <span>Public Link {publicLink ? '• Active' : ''}</span>
        </button>
      </div>

      {/* TAB 1: COLLABORATORS */}
      {activeTab === 'collaborators' && (
        <div className="space-y-5">
          {/* Invite Form */}
          <form onSubmit={handleInvite} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  if (inviteError) setInviteError('');
                }}
                placeholder="Enter user email (e.g. john@email.com)"
                error={inviteError}
              />
            </div>

            <select
              value={invitePermission}
              onChange={(e) => setInvitePermission(e.target.value)}
              className="h-9 px-3 bg-white border border-outline rounded-lg text-xs font-medium text-on-surface outline-none focus:border-primary"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isInviting}
              leftIcon={<UserPlus size={15} />}
            >
              Invite
            </Button>
          </form>

          {/* Collaborator List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted">
              People with access
            </h4>

            {isLoading ? (
              <div className="py-6 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={20} />
              </div>
            ) : (
              <div className="divide-y divide-surface-dim border border-outline rounded-xl overflow-hidden bg-white">
                {/* Owner Row */}
                {collaboratorsData.owner && (
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {collaboratorsData.owner.fullName?.[0] || 'O'}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-on-surface truncate">
                          {collaboratorsData.owner.fullName}
                        </p>
                        <p className="text-[11px] text-on-surface-muted truncate">
                          {collaboratorsData.owner.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="primary" size="sm">
                      Owner
                    </Badge>
                  </div>
                )}

                {/* Collaborators Rows */}
                {collaboratorsData.collaborators.map((c) => (
                  <div key={c.shareId} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {c.fullName?.[0] || 'U'}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-on-surface truncate">{c.fullName}</p>
                        <p className="text-[11px] text-on-surface-muted truncate">{c.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DropdownMenu
                        trigger={
                          <button className="h-7 px-2.5 bg-surface-dim hover:bg-surface-container-high border border-outline rounded-lg text-xs font-medium text-on-surface flex items-center gap-1.5">
                            <span className="capitalize">{c.permission}</span>
                            <ChevronDown size={12} className="text-on-surface-muted" />
                          </button>
                        }
                      >
                        <DropdownItem
                          onClick={() => updatePermission(c.shareId, 'viewer', resourceType, item.id)}
                          className={c.permission === 'viewer' ? 'text-primary font-semibold' : ''}
                        >
                          Viewer (Read only)
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => updatePermission(c.shareId, 'editor', resourceType, item.id)}
                          className={c.permission === 'editor' ? 'text-primary font-semibold' : ''}
                        >
                          Editor (Can edit & move)
                        </DropdownItem>
                      </DropdownMenu>

                      <button
                        type="button"
                        onClick={() => revokeCollaborator(c.shareId, resourceType, item.id)}
                        className="p-1.5 text-on-surface-muted hover:text-accent-error rounded-lg hover:bg-surface-dim"
                        title="Remove Access"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PUBLIC LINK */}
      {activeTab === 'public-link' && (
        <div className="space-y-4">
          {publicLink ? (
            /* Active Link View */
            <div className="space-y-4">
              <div className="p-4 bg-accent-success-container border border-accent-success/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-success animate-pulse" />
                  <div>
                    <h5 className="text-xs font-bold text-accent-success-on">Public Link Active</h5>
                    <p className="text-[11px] text-accent-success-on/80">
                      Anyone with the link can {publicLink.permission} this {resourceType}.
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive-outline"
                  size="sm"
                  onClick={() => deletePublicLink(resourceType, item.id)}
                  leftIcon={<Trash2 size={13} />}
                >
                  Revoke Link
                </Button>
              </div>

              {/* Link Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={fullShareUrl}
                  className="w-full h-9 px-3 bg-surface-dim border border-outline rounded-lg text-xs font-mono text-on-surface select-all outline-none"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCopyLink}
                  leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                >
                  {copied ? 'Copied' : 'Copy Link'}
                </Button>
              </div>

              {/* Link Details */}
              <div className="p-3 bg-surface-dim rounded-xl border border-outline space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Password Protected:</span>
                  <span className="font-semibold text-on-surface">
                    {publicLink.is_password_protected || publicLink.isPasswordProtected ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span className="font-semibold text-on-surface">
                    {publicLink.expires_at || publicLink.expiresAt
                      ? formatDate(publicLink.expires_at || publicLink.expiresAt)
                      : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Generate Link Form */
            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant">
                Generate a secure public URL to share this resource with external people without an account.
              </p>

              {/* Password Protection Toggle */}
              <div className="p-3 border border-outline rounded-xl space-y-3 bg-white">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPasswordProtected}
                    onChange={(e) => setIsPasswordProtected(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                    <Lock size={13} className="text-primary" />
                    Protect with Password
                  </span>
                </label>

                {isPasswordProtected && (
                  <Input
                    type="password"
                    placeholder="Enter access password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
              </div>

              {/* Expiration Date */}
              <div className="p-3 border border-outline rounded-xl space-y-2 bg-white">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                  <Calendar size={13} className="text-primary" />
                  Set Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-outline rounded-lg text-xs text-on-surface outline-none focus:border-primary"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleCreateLink}
                isLoading={isCreatingLink}
                leftIcon={<LinkIcon size={15} />}
                className="w-full"
              >
                Create Public Share Link
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}