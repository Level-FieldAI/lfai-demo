import { apiClient } from './client';
import {
  LoginCredentials,
  AuthResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  ConfirmPasswordResetRequest,
  UserRole,
} from '@/types/auth';
import { PaginatedResponse } from '@/types';

export const authApi = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  },

  async refreshToken(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh');
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  // Password management
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.post<void>('/auth/change-password', data);
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    return apiClient.post<void>('/auth/reset-password', data);
  },

  async confirmPasswordReset(data: ConfirmPasswordResetRequest): Promise<void> {
    return apiClient.post<void>('/auth/confirm-reset-password', data);
  },

  // User management (admin only)
  async getUsers(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>('/users', params);
  },

  async getUser(userId: string): Promise<User> {
    return apiClient.get<User>(`/users/${userId}`);
  },

  async createUser(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User>('/users', data);
  },

  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.patch<User>(`/users/${userId}`, data);
  },

  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete<void>(`/users/${userId}`);
  },

  async activateUser(userId: string): Promise<User> {
    return apiClient.post<User>(`/users/${userId}/activate`);
  },

  async deactivateUser(userId: string): Promise<User> {
    return apiClient.post<User>(`/users/${userId}/deactivate`);
  },

  // Role management
  async getRoles(): Promise<UserRole[]> {
    return apiClient.get<UserRole[]>('/roles');
  },

  async getRole(roleId: string): Promise<UserRole> {
    return apiClient.get<UserRole>(`/roles/${roleId}`);
  },

  async createRole(data: Omit<UserRole, 'id'>): Promise<UserRole> {
    return apiClient.post<UserRole>('/roles', data);
  },

  async updateRole(roleId: string, data: Partial<UserRole>): Promise<UserRole> {
    return apiClient.patch<UserRole>(`/roles/${roleId}`, data);
  },

  async deleteRole(roleId: string): Promise<void> {
    return apiClient.delete<void>(`/roles/${roleId}`);
  },

  // User preferences
  async updateUserPreferences(userId: string, preferences: any): Promise<User> {
    return apiClient.patch<User>(`/users/${userId}/preferences`, { preferences });
  },

  // Session management
  async getSessions(userId?: string): Promise<any[]> {
    const endpoint = userId ? `/users/${userId}/sessions` : '/auth/sessions';
    return apiClient.get<any[]>(endpoint);
  },

  async revokeSession(sessionId: string): Promise<void> {
    return apiClient.delete<void>(`/auth/sessions/${sessionId}`);
  },

  async revokeAllSessions(): Promise<void> {
    return apiClient.delete<void>('/auth/sessions');
  },

  // Audit logs
  async getAuditLogs(params?: {
    page?: number;
    page_size?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<any>> {
    return apiClient.get<PaginatedResponse<any>>('/audit-logs', params);
  },
};

// Mock implementation for development (remove in production)
export const mockAuthApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const mockUser: User = {
        id: '1',
        username: 'admin',
        email: 'admin@levelfield.ai',
        firstName: 'Admin',
        lastName: 'User',
        role: {
          id: '1',
          name: 'admin',
          description: 'Administrator',
          permissions: [
            { id: '1', name: 'conversations.read', resource: 'conversations', action: 'read', description: 'Read conversations' },
            { id: '2', name: 'conversations.export', resource: 'conversations', action: 'export', description: 'Export conversations' },
            { id: '3', name: 'users.read', resource: 'users', action: 'read', description: 'Read users' },
            { id: '4', name: 'users.create', resource: 'users', action: 'create', description: 'Create users' },
            { id: '5', name: 'analytics.read', resource: 'analytics', action: 'read', description: 'Read analytics' },
          ],
          isSystem: true,
        },
        permissions: [
          { id: '1', name: 'conversations.read', resource: 'conversations', action: 'read', description: 'Read conversations' },
          { id: '2', name: 'conversations.export', resource: 'conversations', action: 'export', description: 'Export conversations' },
          { id: '3', name: 'users.read', resource: 'users', action: 'read', description: 'Read users' },
          { id: '4', name: 'users.create', resource: 'users', action: 'create', description: 'Create users' },
          { id: '5', name: 'analytics.read', resource: 'analytics', action: 'read', description: 'Read analytics' },
        ],
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/dd/yyyy',
          autoRefresh: true,
          refreshInterval: 30000,
          itemsPerPage: 20,
          notifications: {
            email: true,
            browser: true,
            conversationComplete: true,
            systemAlerts: true,
          },
        },
      };

      const mockToken = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      };

      return {
        user: mockUser,
        token: mockToken,
        permissions: mockUser.permissions.map(p => p.name),
      };
    }

    throw new Error('Invalid credentials');
  },

  async getCurrentUser(): Promise<User> {
    // Return mock user if token exists
    const token = localStorage.getItem('lfai_access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    return {
      id: '1',
      username: 'admin',
      email: 'admin@levelfield.ai',
      firstName: 'Admin',
      lastName: 'User',
      role: {
        id: '1',
        name: 'admin',
        description: 'Administrator',
        permissions: [],
        isSystem: true,
      },
      permissions: [
        { id: '1', name: 'conversations.read', resource: 'conversations', action: 'read', description: 'Read conversations' },
        { id: '2', name: 'conversations.export', resource: 'conversations', action: 'export', description: 'Export conversations' },
        { id: '3', name: 'users.read', resource: 'users', action: 'read', description: 'Read users' },
        { id: '4', name: 'users.create', resource: 'users', action: 'create', description: 'Create users' },
        { id: '5', name: 'analytics.read', resource: 'analytics', action: 'read', description: 'Read analytics' },
      ],
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/dd/yyyy',
        autoRefresh: true,
        refreshInterval: 30000,
        itemsPerPage: 20,
        notifications: {
          email: true,
          browser: true,
          conversationComplete: true,
          systemAlerts: true,
        },
      },
    };
  },

  async logout(): Promise<void> {
    // Clear tokens
    localStorage.removeItem('lfai_access_token');
    localStorage.removeItem('lfai_refresh_token');
    localStorage.removeItem('lfai_user');
  },
};

// Use mock API in development, real API in production
export const useAuthApi = import.meta.env.DEV ? mockAuthApi : authApi;