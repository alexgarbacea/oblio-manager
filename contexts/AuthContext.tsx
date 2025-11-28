'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OblioCredentials } from '@/lib/types';
import { storage } from '@/lib/storage';
import { OblioAPI } from '@/lib/api';

interface AuthContextType {
  credentials: OblioCredentials | null;
  isAuthenticated: boolean;
  login: (clientId: string, clientSecret: string) => Promise<void>;
  logout: () => void;
  updateToken: (token: string, expiry: number) => void;
  getAPI: () => OblioAPI | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<OblioCredentials | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = storage.getCredentials();
    if (stored && storage.isTokenValid(stored)) {
      setCredentials(stored);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (clientId: string, clientSecret: string) => {
    const api = new OblioAPI({ clientId, clientSecret });
    const newCredentials = await api.authenticate();
    storage.saveCredentials(newCredentials);
    setCredentials(newCredentials);
    setIsAuthenticated(true);
  };

  const logout = () => {
    storage.clearCredentials();
    setCredentials(null);
    setIsAuthenticated(false);
  };

  const updateToken = (token: string, expiry: number) => {
    if (credentials) {
      const updated = {
        ...credentials,
        accessToken: token,
        tokenExpiry: expiry,
      };
      storage.saveCredentials(updated);
      setCredentials(updated);
    }
  };

  const getAPI = () => {
    if (!credentials || !credentials.accessToken) {
      return null;
    }
    return new OblioAPI(credentials);
  };

  return (
    <AuthContext.Provider
      value={{
        credentials,
        isAuthenticated,
        login,
        logout,
        updateToken,
        getAPI,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
