import { useState, useEffect, useCallback } from 'react';
import { useConversationsApi } from '@/api/conversations';
import {
  IConversation,
  GetConversationsParams,
  ConversationsResponse,
  ConversationFilters,
  ConversationStats,
} from '@/types/conversations';

interface UseConversationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  initialFilters?: Partial<ConversationFilters>;
}

export const useConversations = ({
  autoRefresh = false,
  refreshInterval = 30000,
  initialFilters = {},
}: UseConversationsOptions = {}) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<ConversationFilters>({
    status: 'all',
    dateRange: { start: null, end: null },
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    ...initialFilters,
  });

  const fetchConversations = useCallback(async (params?: GetConversationsParams) => {
    try {
      setLoading(true);
      setError(null);

      const requestParams: GetConversationsParams = {
        page: currentPage,
        page_size: pageSize,
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search || undefined,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
        start_date: filters.dateRange.start?.toISOString(),
        end_date: filters.dateRange.end?.toISOString(),
        ...params,
      };

      const response: ConversationsResponse = await useConversationsApi.getConversations(requestParams);
      
      setConversations(response.conversations);
      setTotalCount(response.total_count);
      setTotalPages(response.total_pages);
      setCurrentPage(response.page);
      setPageSize(response.page_size);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversations';
      setError(errorMessage);
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchConversations();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchConversations]);

  const refresh = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  const updateFilters = useCallback((newFilters: Partial<ConversationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  const searchConversations = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await useConversationsApi.searchConversations(query, {
        page: 1,
        page_size: pageSize,
        status: filters.status !== 'all' ? filters.status : undefined,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
      });

      setConversations(response.conversations);
      setTotalCount(response.total_count);
      setTotalPages(response.total_pages);
      setCurrentPage(1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Error searching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSize, filters]);

  return {
    conversations,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    filters,
    refresh,
    updateFilters,
    goToPage,
    changePageSize,
    searchConversations,
  };
};

export const useConversationStats = () => {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await useConversationsApi.getConversationStats();
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Error fetching conversation stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};

export const useConversation = (conversationId: string) => {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      setError(null);
      const conversationData = await useConversationsApi.getConversation(conversationId);
      setConversation(conversationData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversation';
      setError(errorMessage);
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const deleteConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      await useConversationsApi.deleteConversation(conversationId);
      return true;
    } catch (err) {
      console.error('Error deleting conversation:', err);
      throw err;
    }
  }, [conversationId]);

  return {
    conversation,
    loading,
    error,
    refresh: fetchConversation,
    deleteConversation,
  };
};