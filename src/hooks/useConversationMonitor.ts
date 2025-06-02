import { useState, useEffect, useCallback } from 'react';
import { getConversation } from '@/api';
import { IConversation, ConversationStatus } from '@/types';

interface UseConversationMonitorOptions {
  conversationId?: string;
  onConversationComplete?: (conversation: IConversation) => void;
  onConversationError?: (conversation: IConversation) => void;
  pollInterval?: number;
  enabled?: boolean;
}

export const useConversationMonitor = ({
  conversationId,
  onConversationComplete,
  onConversationError,
  pollInterval = 3000,
  enabled = true,
}: UseConversationMonitorOptions) => {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConversationStatus = useCallback(async () => {
    if (!conversationId || !enabled) return;

    try {
      setLoading(true);
      setError(null);
      
      const updatedConversation = await getConversation(conversationId);
      setConversation(updatedConversation);

      // Check if conversation status changed to completed or error
      if (conversation && conversation.status !== updatedConversation.status) {
        if (updatedConversation.status === ConversationStatus.ENDED) {
          onConversationComplete?.(updatedConversation);
        } else if (updatedConversation.status === ConversationStatus.ERROR) {
          onConversationError?.(updatedConversation);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversation';
      setError(errorMessage);
      console.error('Error monitoring conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, enabled, conversation, onConversationComplete, onConversationError]);

  useEffect(() => {
    if (!conversationId || !enabled) return;

    // Initial check
    checkConversationStatus();

    // Set up polling only if conversation is active
    const shouldPoll = !conversation || conversation.status === ConversationStatus.ACTIVE;
    
    if (shouldPoll) {
      const interval = setInterval(checkConversationStatus, pollInterval);
      return () => clearInterval(interval);
    }
  }, [conversationId, enabled, pollInterval, checkConversationStatus, conversation?.status]);

  const refreshConversation = useCallback(() => {
    checkConversationStatus();
  }, [checkConversationStatus]);

  return {
    conversation,
    loading,
    error,
    refreshConversation,
    isActive: conversation?.status === ConversationStatus.ACTIVE,
    isCompleted: conversation?.status === ConversationStatus.ENDED,
    hasError: conversation?.status === ConversationStatus.ERROR,
  };
};