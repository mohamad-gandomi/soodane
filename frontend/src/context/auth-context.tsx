'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { authService } from '@/services/auth.service';
import { storage } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const savedToken = storage.getToken();
      const savedUser = storage.getUser<User>();

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) setUser(savedUser);

        // Validate and sync latest profile from backend
        try {
          const freshUser = await authService.getProfile();
          if (freshUser) {
            setUser(freshUser);
          } else {
            // Token expired or invalid
            setUser(null);
            setToken(null);
          }
        } catch {
          // Keep cached user if network is momentarily unavailable
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    storage.setToken(newToken);
    storage.setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    try {
      const updated = await authService.getProfile();
      if (updated) {
        setUser(updated);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
