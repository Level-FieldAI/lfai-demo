export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface AuthResponse {
  user: User;
  token: AuthToken;
  permissions: string[];
}

export interface Session {
  user: User;
  token: AuthToken;
  permissions: string[];
  expiresAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  autoRefresh: boolean;
  refreshInterval: number;
  itemsPerPage: number;
  notifications: {
    email: boolean;
    browser: boolean;
    conversationComplete: boolean;
    systemAlerts: boolean;
  };
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  isActive?: boolean;
  preferences?: Partial<UserPreferences>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmPasswordResetRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Predefined roles
export enum UserRoleEnum {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

// Predefined permissions
export enum PermissionEnum {
  // Conversations
  CONVERSATIONS_READ = 'conversations.read',
  CONVERSATIONS_EXPORT = 'conversations.export',
  CONVERSATIONS_DELETE = 'conversations.delete',
  
  // Users
  USERS_READ = 'users.read',
  USERS_CREATE = 'users.create',
  USERS_UPDATE = 'users.update',
  USERS_DELETE = 'users.delete',
  
  // Analytics
  ANALYTICS_READ = 'analytics.read',
  
  // Settings
  SETTINGS_UPDATE = 'settings.update',
  
  // Audit
  AUDIT_READ = 'audit.read'
}