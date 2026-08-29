import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users.api';
import { formatBytes } from '../utils/formatters';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { User, HardDrive, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export function SettingsPage() {
  const { user, storage, updateUserProfile, refreshStorage } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const usedBytes = storage?.storageUsedBytes || 0;
  const limitBytes = storage?.storageLimitBytes || 5368709120;
  const remainingBytes = storage?.remainingBytes || limitBytes - usedBytes;
  const usagePercentage = Math.round(storage?.usagePercentage || (usedBytes / limitBytes) * 100);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await usersApi.updateMe({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl.trim() || null,
      });
      if (res?.data) {
        updateUserProfile(res.data);
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Account & Workspace Settings</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Manage your personal profile information and storage capacity.
        </p>
      </div>

      {/* Card 1: User Profile */}
      <div className="bg-white rounded-2xl border border-outline shadow-level-1 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-outline">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Profile Details</h3>
              <p className="text-xs text-on-surface-variant">Update your public name and avatar.</p>
            </div>
          </div>

          <Badge variant="success" size="sm" className="font-semibold gap-1">
            <Sparkles size={11} /> PRO Plan
          </Badge>
        </div>

        {statusMessage.text && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'bg-accent-success-container text-accent-success-on border border-accent-success/20'
                : 'bg-accent-error-container text-accent-error-on border border-accent-error/20'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-2xl object-cover border border-outline"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl">
                {fullName?.[0] || 'U'}
              </div>
            )}
            <div className="flex-1">
              <Input
                label="Avatar Image URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Alex Mercer"
            required
          />

          <Input
            label="Email Address"
            value={user?.email || ''}
            disabled
            helperText="Email address cannot be changed."
          />

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Card 2: Storage Quota Analytics */}
      <div className="bg-white rounded-2xl border border-outline shadow-level-1 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-outline">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <HardDrive size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">Storage Capacity</h3>
            <p className="text-xs text-on-surface-variant">Cloud object storage breakdown.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold text-on-surface">{formatBytes(usedBytes)}</p>
              <p className="text-xs text-on-surface-variant">used of {formatBytes(limitBytes)}</p>
            </div>
            <span className="text-sm font-bold text-primary">{usagePercentage}% Used</span>
          </div>

          <ProgressBar value={usedBytes} max={limitBytes} size="lg" color="auto" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-surface-dim rounded-xl border border-outline">
              <span className="text-[11px] font-semibold text-on-surface-muted uppercase">
                Available Storage
              </span>
              <p className="text-base font-bold text-on-surface mt-0.5">
                {formatBytes(remainingBytes)}
              </p>
            </div>
            <div className="p-3.5 bg-surface-dim rounded-xl border border-outline">
              <span className="text-[11px] font-semibold text-on-surface-muted uppercase">
                Storage Limit
              </span>
              <p className="text-base font-bold text-on-surface mt-0.5">
                {formatBytes(limitBytes)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}