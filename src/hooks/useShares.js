import { useState, useCallback } from 'react';
import { sharesApi } from '../api/shares.api';
import { publicLinksApi } from '../api/publicLinks.api';

export function useShares() {
  const [collaboratorsData, setCollaboratorsData] = useState({ owner: null, collaborators: [] });
  const [publicLink, setPublicLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load collaborators for a resource
  const loadCollaborators = useCallback(async (resourceType, resourceId) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await sharesApi.getCollaborators(resourceType, resourceId);
      if (res?.data) {
        setCollaboratorsData({
          owner: res.data.owner,
          collaborators: res.data.collaborators || [],
        });
      }
    } catch (err) {
      console.error('Failed to load collaborators:', err);
      setError(err.message || 'Failed to load collaborators');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load public share link status
  const loadPublicLink = useCallback(async (resourceType, resourceId) => {
    setIsLoading(true);
    try {
      const res = await publicLinksApi.getPublicLinkStatus(resourceType, resourceId);
      setPublicLink(res?.data || null);
    } catch (err) {
      // 404 or inactive link is normal
      setPublicLink(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Invite a new collaborator
  const inviteCollaborator = async ({ resourceType, resourceId, email, permission }) => {
    const res = await sharesApi.shareResource({ resourceType, resourceId, email, permission });
    await loadCollaborators(resourceType, resourceId);
    return res;
  };

  // Update collaborator permission (viewer <-> editor)
  const updatePermission = async (shareId, permission, resourceType, resourceId) => {
    await sharesApi.updateCollaboratorPermission(shareId, permission);
    await loadCollaborators(resourceType, resourceId);
  };

  // Revoke collaborator access
  const revokeCollaborator = async (shareId, resourceType, resourceId) => {
    await sharesApi.revokeAccess(shareId);
    await loadCollaborators(resourceType, resourceId);
  };

  // Generate public link
  const createPublicLink = async (payload) => {
    const res = await publicLinksApi.createPublicLink(payload);
    setPublicLink(res.data);
    return res.data;
  };

  // Revoke public link
  const deletePublicLink = async (resourceType, resourceId) => {
    await publicLinksApi.deletePublicLink(resourceType, resourceId);
    setPublicLink(null);
  };

  return {
    collaboratorsData,
    publicLink,
    isLoading,
    error,
    loadCollaborators,
    loadPublicLink,
    inviteCollaborator,
    updatePermission,
    revokeCollaborator,
    createPublicLink,
    deletePublicLink,
  };
}