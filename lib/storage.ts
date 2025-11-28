import { OblioCredentials } from './types';

const STORAGE_KEY = 'oblio_credentials';

export const storage = {
  saveCredentials: (credentials: OblioCredentials) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    }
  },

  getCredentials: (): OblioCredentials | null => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  clearCredentials: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  isTokenValid: (credentials: OblioCredentials): boolean => {
    if (!credentials.accessToken || !credentials.tokenExpiry) {
      return false;
    }
    return Date.now() < credentials.tokenExpiry;
  },
};
