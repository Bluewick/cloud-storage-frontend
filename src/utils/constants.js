export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5783';

export const TOKEN_STORAGE_KEY = 'lumina_auth_token';
export const USER_STORAGE_KEY = 'lumina_user_profile';

export const PERMISSIONS = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  OWNER: 'owner',
};

export const RESOURCE_TYPES = {
  FILE: 'file',
  FOLDER: 'folder',
};

export const DEFAULT_STORAGE_LIMIT_BYTES = 5368709120; // 5 GB default