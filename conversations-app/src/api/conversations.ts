import { apiClient } from './client';
import {
  IConversation,
  GetConversationsParams,
  ConversationsResponse,
  ConversationStats,
  ConversationAnalytics,
  ExportOptions,
  BulkOperation,
} from '@/types/conversations';

export const conversationsApi = {
  // Get conversations with pagination and filtering
  async getConversations(params?: GetConversationsParams): Promise<ConversationsResponse> {
    return apiClient.get<ConversationsResponse>('/conversations', params);
  },

  // Get a specific conversation
  async getConversation(conversationId: string): Promise<IConversation> {
    return apiClient.get<IConversation>(`/conversations/${conversationId}`);
  },

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    return apiClient.delete<void>(`/conversations/${conversationId}`);
  },

  // Get conversation statistics
  async getConversationStats(): Promise<ConversationStats> {
    return apiClient.get<ConversationStats>('/conversations/stats');
  },

  // Get conversation analytics
  async getConversationAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<ConversationAnalytics> {
    return apiClient.get<ConversationAnalytics>('/conversations/analytics', params);
  },

  // Export conversations
  async exportConversations(options: ExportOptions): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}/conversations/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('lfai_access_token')}`,
        'x-api-key': import.meta.env.VITE_TAVUS_API_KEY || '',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  // Bulk operations
  async bulkOperation(operation: BulkOperation): Promise<void> {
    return apiClient.post<void>('/conversations/bulk', operation);
  },

  // Search conversations
  async searchConversations(query: string, params?: GetConversationsParams): Promise<ConversationsResponse> {
    return apiClient.get<ConversationsResponse>('/conversations/search', {
      q: query,
      ...params,
    });
  },
};

// Mock implementation for development
export const mockConversationsApi = {
  async getConversations(params?: GetConversationsParams): Promise<ConversationsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate mock conversations
    const mockConversations: IConversation[] = Array.from({ length: 15 }, (_, i) => ({
      conversation_id: `conv_${i + 1}`,
      conversation_name: `Conversation ${i + 1}`,
      status: ['active', 'ended', 'error'][Math.floor(Math.random() * 3)] as any,
      conversation_url: `https://example.com/conv_${i + 1}`,
      replica_id: `replica_${i + 1}`,
      persona_id: `persona_${i + 1}`,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      ended_at: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString() : undefined,
      duration: Math.floor(Math.random() * 3600) + 60, // 1 minute to 1 hour
      participant_count: Math.floor(Math.random() * 5) + 1,
      recording_url: Math.random() > 0.5 ? `https://example.com/recording_${i + 1}.mp4` : undefined,
      properties: {
        language: ['en', 'es', 'fr'][Math.floor(Math.random() * 3)],
        quality: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      },
    }));

    // Apply filters
    let filteredConversations = mockConversations;
    
    if (params?.status && params.status !== 'all') {
      filteredConversations = filteredConversations.filter(c => c.status === params.status);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredConversations = filteredConversations.filter(c => 
        c.conversation_name.toLowerCase().includes(searchLower) ||
        c.conversation_id.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (params?.sort_by) {
      filteredConversations.sort((a, b) => {
        const aVal = a[params.sort_by as keyof IConversation];
        const bVal = b[params.sort_by as keyof IConversation];
        
        if (params.sort_order === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Apply pagination
    const page = params?.page || 1;
    const pageSize = params?.page_size || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedConversations = filteredConversations.slice(startIndex, endIndex);

    return {
      conversations: paginatedConversations,
      total_count: filteredConversations.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(filteredConversations.length / pageSize),
    };
  },

  async getConversation(conversationId: string): Promise<IConversation> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      conversation_id: conversationId,
      conversation_name: `Conversation ${conversationId}`,
      status: 'ended',
      conversation_url: `https://example.com/${conversationId}`,
      replica_id: `replica_${conversationId}`,
      persona_id: `persona_${conversationId}`,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      ended_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      duration: 1847, // ~30 minutes
      participant_count: 2,
      recording_url: `https://example.com/recording_${conversationId}.mp4`,
      properties: {
        language: 'en',
        quality: 'high',
        transcript: 'This is a sample conversation transcript...',
      },
    };
  },

  async getConversationStats(): Promise<ConversationStats> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      total: 1247,
      active: 23,
      ended: 1198,
      error: 26,
      totalDuration: 2847392, // in seconds
      averageDuration: 2284, // in seconds
      todayCount: 45,
      weekCount: 312,
      monthCount: 1247,
    };
  },

  async getConversationAnalytics(): Promise<ConversationAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock daily stats for the last 30 days
    const dailyStats = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 50) + 10,
        duration: Math.floor(Math.random() * 50000) + 10000,
      };
    });

    return {
      dailyStats,
      statusDistribution: [
        { status: 'ended', count: 1198, percentage: 96.1 },
        { status: 'error', count: 26, percentage: 2.1 },
        { status: 'active', count: 23, percentage: 1.8 },
      ],
      averageMetrics: {
        duration: 2284,
        participantCount: 2.3,
        completionRate: 96.1,
      },
      trends: {
        conversationsGrowth: 12.5,
        durationTrend: -3.2,
        completionRateTrend: 1.8,
      },
    };
  },

  async deleteConversation(conversationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Mock: Deleted conversation ${conversationId}`);
  },

  async exportConversations(options: ExportOptions): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock CSV file
    const csvContent = `conversation_id,conversation_name,status,created_at,duration
conv_1,Conversation 1,ended,2024-01-01T10:00:00Z,1847
conv_2,Conversation 2,ended,2024-01-01T11:00:00Z,2156`;
    
    return new Blob([csvContent], { type: 'text/csv' });
  },

  async bulkOperation(operation: BulkOperation): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Mock: Performed ${operation.action} on ${operation.conversationIds.length} conversations`);
  },

  async searchConversations(query: string, params?: GetConversationsParams): Promise<ConversationsResponse> {
    // Use the same mock data but filter by search query
    return this.getConversations({ ...params, search: query });
  },
};

// Use mock API in development, real API in production
export const useConversationsApi = import.meta.env.DEV ? mockConversationsApi : conversationsApi;