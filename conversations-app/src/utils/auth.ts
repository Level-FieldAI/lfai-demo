import { jwtDecode } from 'jwt-decode';
import { AuthToken, User, Permission } from '@/types/auth';

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'lfai_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'lfai_refresh_token';
  private static readonly USER_KEY = 'lfai_user';

  static setTokens(tokens: AuthToken): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  static getTokenExpirationTime(token: string): Date | null {
    try {
      const decoded: any = jwtDecode(token);
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }

  static shouldRefreshToken(token: string, thresholdMinutes: number = 5): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const thresholdTime = thresholdMinutes * 60;
      return decoded.exp - currentTime < thresholdTime;
    } catch {
      return true;
    }
  }
}

export class PermissionChecker {
  static hasPermission(user: User, permission: string): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.some(p => p.name === permission);
  }

  static hasRole(user: User, role: string): boolean {
    if (!user || !user.role) return false;
    return user.role.name === role;
  }

  static hasAnyPermission(user: User, permissions: string[]): boolean {
    if (!user || !user.permissions || permissions.length === 0) return false;
    return permissions.some(permission => this.hasPermission(user, permission));
  }

  static hasAllPermissions(user: User, permissions: string[]): boolean {
    if (!user || !user.permissions || permissions.length === 0) return false;
    return permissions.every(permission => this.hasPermission(user, permission));
  }

  static canAccessResource(user: User, resource: string, action: string): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.some(p => p.resource === resource && p.action === action);
  }

  static filterByPermissions<T>(
    items: T[], 
    user: User, 
    permission: string,
    getItemPermission?: (item: T) => string
  ): T[] {
    if (!user || !this.hasPermission(user, permission)) return [];
    
    if (getItemPermission) {
      return items.filter(item => this.hasPermission(user, getItemPermission(item)));
    }
    
    return items;
  }

  static getPermissionsByResource(user: User, resource: string): Permission[] {
    if (!user || !user.permissions) return [];
    return user.permissions.filter(p => p.resource === resource);
  }

  static isAdmin(user: User): boolean {
    return this.hasRole(user, 'admin') || this.hasRole(user, 'super_admin');
  }

  static isSuperAdmin(user: User): boolean {
    return this.hasRole(user, 'super_admin');
  }
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateSecurePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*(),.?":{}|<>';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const formatLastLogin = (lastLogin: Date | undefined): string => {
  if (!lastLogin) return 'Never';
  
  const now = new Date();
  const diff = now.getTime() - new Date(lastLogin).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return new Date(lastLogin).toLocaleDateString();
};