import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';
import * as authService from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const token = authService.getAuthToken();

        if (storedUser && token) {
          // Verify token by fetching profile
          try {
            const profile = await authService.getProfile();
            setUser(profile.data);
            // Update stored user with latest data
            authService.setStoredUser(profile.data);
          } catch {
            // Token invalid, clear storage
            authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.register(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile.data);
      authService.setStoredUser(profile.data);
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
