import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getUsageStats,
  canStartCall,
  startSession,
  endSession,
  isSessionExpired,
  UsageStats
} from '@/utils/usageTracker';

export interface SessionManagerState {
  isSessionActive: boolean;
  usageStats: UsageStats;
  sessionDuration: number; // in seconds
  showUsageLimitModal: boolean;
  showSessionEndModal: boolean;
  usageLimitType: 'daily-limit' | 'session-limit' | null;
  sessionEndReason: 'time-limit' | 'user-ended' | 'error' | null;
}

export interface SessionManagerActions {
  startNewSession: () => Promise<boolean>;
  endCurrentSession: (reason?: 'user-ended' | 'error') => void;
  closeUsageLimitModal: () => void;
  closeSessionEndModal: () => void;
  refreshUsageStats: () => void;
}

export interface UseSessionManagerOptions {
  onSessionStart?: () => void;
  onSessionEnd?: (reason: 'time-limit' | 'user-ended' | 'error', duration: number) => void;
  onUsageLimitReached?: (type: 'daily-limit' | 'session-limit') => void;
  onTimeWarning?: (timeRemaining: number) => void;
  autoEndOnTimeLimit?: boolean;
}

export const useSessionManager = (options: UseSessionManagerOptions = {}) => {
  const {
    onSessionStart,
    onSessionEnd,
    onUsageLimitReached,
    onTimeWarning,
    autoEndOnTimeLimit = true
  } = options;

  const [state, setState] = useState<SessionManagerState>({
    isSessionActive: false,
    usageStats: getUsageStats(),
    sessionDuration: 0,
    showUsageLimitModal: false,
    showSessionEndModal: false,
    usageLimitType: null,
    sessionEndReason: null,
  });

  const sessionStartTimeRef = useRef<number | null>(null);
  const warningShownRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update usage stats and check session status
  const updateSessionState = useCallback(() => {
    const stats = getUsageStats();
    let duration = 0;

    if (sessionStartTimeRef.current) {
      duration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
    }

    setState(prev => ({
      ...prev,
      usageStats: stats,
      sessionDuration: duration,
      isSessionActive: stats.isSessionActive,
    }));

    // Check for time warnings (1 minute remaining)
    if (stats.isSessionActive && stats.timeRemaining <= 60 && stats.timeRemaining > 0 && !warningShownRef.current) {
      warningShownRef.current = true;
      onTimeWarning?.(stats.timeRemaining);
    }

    // Reset warning flag when time goes above 1 minute
    if (stats.timeRemaining > 60) {
      warningShownRef.current = false;
    }

    // Auto-end session if time limit reached
    if (autoEndOnTimeLimit && isSessionExpired() && stats.isSessionActive) {
      endCurrentSession('time-limit');
    }
  }, [onTimeWarning, autoEndOnTimeLimit]);

  // Start monitoring when session becomes active
  useEffect(() => {
    if (state.isSessionActive) {
      intervalRef.current = setInterval(updateSessionState, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isSessionActive, updateSessionState]);

  // Initial state update
  useEffect(() => {
    updateSessionState();
  }, [updateSessionState]);

  // Start a new session
  const startNewSession = useCallback(async (): Promise<boolean> => {
    // Check if user can start a call
    if (!canStartCall()) {
      setState(prev => ({
        ...prev,
        showUsageLimitModal: true,
        usageLimitType: 'daily-limit',
      }));
      onUsageLimitReached?.('daily-limit');
      return false;
    }

    // Start the session
    const success = startSession();
    if (success) {
      sessionStartTimeRef.current = Date.now();
      warningShownRef.current = false;
      
      setState(prev => ({
        ...prev,
        isSessionActive: true,
        sessionDuration: 0,
        usageStats: getUsageStats(),
      }));

      onSessionStart?.();
      return true;
    }

    return false;
  }, [onSessionStart, onUsageLimitReached]);

  // End current session
  const endCurrentSession = useCallback((reason: 'time-limit' | 'user-ended' | 'error' = 'user-ended') => {
    if (!state.isSessionActive) return;

    const duration = sessionStartTimeRef.current 
      ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
      : 0;

    // End the session in storage
    endSession();

    // Update state
    setState(prev => ({
      ...prev,
      isSessionActive: false,
      sessionDuration: duration,
      usageStats: getUsageStats(),
      showSessionEndModal: true,
      sessionEndReason: reason,
    }));

    // Reset refs
    sessionStartTimeRef.current = null;
    warningShownRef.current = false;

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    onSessionEnd?.(reason, duration);
  }, [state.isSessionActive, onSessionEnd]);

  // Close usage limit modal
  const closeUsageLimitModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showUsageLimitModal: false,
      usageLimitType: null,
    }));
  }, []);

  // Close session end modal
  const closeSessionEndModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showSessionEndModal: false,
      sessionEndReason: null,
    }));
  }, []);

  // Refresh usage stats
  const refreshUsageStats = useCallback(() => {
    setState(prev => ({
      ...prev,
      usageStats: getUsageStats(),
    }));
  }, []);

  // Handle session expiration
  const handleSessionExpired = useCallback(() => {
    if (state.isSessionActive) {
      setState(prev => ({
        ...prev,
        showUsageLimitModal: true,
        usageLimitType: 'session-limit',
      }));
      onUsageLimitReached?.('session-limit');
      endCurrentSession('time-limit');
    }
  }, [state.isSessionActive, endCurrentSession, onUsageLimitReached]);

  // Handle time warning
  const handleTimeWarning = useCallback((timeRemaining: number) => {
    onTimeWarning?.(timeRemaining);
  }, [onTimeWarning]);

  const actions: SessionManagerActions = {
    startNewSession,
    endCurrentSession,
    closeUsageLimitModal,
    closeSessionEndModal,
    refreshUsageStats,
  };

  return {
    ...state,
    actions,
    handleSessionExpired,
    handleTimeWarning,
  };
};