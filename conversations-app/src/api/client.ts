import { TokenManager } from '@/utils/auth';
import { ApiError, ApiResponse } from '@/types';

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'https://tavusapi.com/v2') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getAccessToken();

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add API key if available (for Tavus API)
    const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken && !TokenManager.isTokenExpired(refreshToken)) {
          try {
            await this.refreshToken();
            // Retry the original request with new token
            const newToken = TokenManager.getAccessToken();
            if (newToken) {
              headers['Authorization'] = `Bearer ${newToken}`;
              const retryResponse = await fetch(url, { ...config, headers });
              return this.handleResponse<T>(retryResponse);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            TokenManager.clearTokens();
            window.location.href = '/login';
            throw new Error('Session expired. Please log in again.');
          }
        } else {
          // No valid refresh token, redirect to login
          TokenManager.clearTokens();
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails: any = null;

      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorDetails = errorData;
        } catch {
          // If JSON parsing fails, use the default error message
        }
      }

      const apiError: ApiError = {
        message: errorMessage,
        code: response.status.toString(),
        details: errorDetails,
      };

      throw apiError;
    }

    if (isJson) {
      return response.json();
    }

    // For non-JSON responses, return the text
    return response.text() as unknown as T;
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    TokenManager.setTokens(data.token);
    TokenManager.setUser(data.user);
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const token = TokenManager.getAccessToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();