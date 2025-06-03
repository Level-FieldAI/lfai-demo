export type ConversationStatus = 'active' | 'ended' | 'error' | 'pending';

export interface IConversation {
  conversation_id: string;
  conversation_name: string;
  status: ConversationStatus;
  conversation_url: string;
  replica_id: string | null;
  persona_id: string | null;
  created_at: string;
  updated_at?: string;
  ended_at?: string;
  duration?: number;
  participant_count?: number;
  recording_url?: string;
  properties?: Record<string, any>;
}

export interface GetConversationsParams {
  page?: number;
  page_size?: number;
  status?: ConversationStatus;
  start_date?: string;
  end_date?: string;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'duration' | 'conversation_name';
  sort_order?: 'asc' | 'desc';
}

export interface ConversationsResponse {
  conversations: IConversation[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ConversationFilters {
  status: ConversationStatus | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  search: string;
  sortBy: 'created_at' | 'updated_at' | 'duration' | 'conversation_name';
  sortOrder: 'asc' | 'desc';
}

export interface ConversationStats {
  total: number;
  active: number;
  ended: number;
  error: number;
  totalDuration: number;
  averageDuration: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

export interface ConversationAnalytics {
  dailyStats: Array<{
    date: string;
    count: number;
    duration: number;
  }>;
  statusDistribution: Array<{
    status: ConversationStatus;
    count: number;
    percentage: number;
  }>;
  averageMetrics: {
    duration: number;
    participantCount: number;
    completionRate: number;
  };
  trends: {
    conversationsGrowth: number;
    durationTrend: number;
    completionRateTrend: number;
  };
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  fields: string[];
  filters: ConversationFilters;
  includeDetails: boolean;
}

export interface BulkOperation {
  action: 'delete' | 'archive' | 'export';
  conversationIds: string[];
  options?: Record<string, any>;
}