import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginCredentials, AuthResponse } from '@/types/auth';
import { TokenManager, PermissionChecker } from '@/utils/auth';
import { useAuthApi } from '@/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const token = TokenManager.getAccessToken();
        if (token && TokenManager.shouldRefreshToken(token)) {
          refreshToken().catch(console.error);
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const initializeAuth = async () => {
    try {
      const token = TokenManager.getAccessToken();
      const storedUser = TokenManager.getUser();

      if (token && storedUser && !TokenManager.isTokenExpired(token)) {
        // Verify token with server
        try {
          const currentUser = await useAuthApi.getCurrentUser();
          setUser(currentUser);
          TokenManager.setUser(currentUser);
        } catch (error) {
          // Token is invalid, clear it
          TokenManager.clearTokens();
          setUser(null);
        }
      } else {
        // No valid token, clear everything
        TokenManager.clearTokens();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      TokenManager.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await useAuthApi.login(credentials);
      
      // Store tokens and user data
      TokenManager.setTokens(response.token);
      TokenManager.setUser(response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await useAuthApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state, even if API call fails
      TokenManager.clearTokens();
      setUser(null);
      setIsLoading(false);
      
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response: AuthResponse = await useAuthApi.refreshToken();
      TokenManager.setTokens(response.token);
      TokenManager.setUser(response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return PermissionChecker.hasPermission(user, permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return PermissionChecker.hasRole(user, role);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return PermissionChecker.hasAnyPermission(user, permissions);
  };

  const canAccess = (resource: string, action: string): boolean => {
    if (!user) return false;
    return PermissionChecker.canAccessResource(user, resource, action);
  };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
    TokenManager.setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    hasAnyPermission,
    canAccess,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};