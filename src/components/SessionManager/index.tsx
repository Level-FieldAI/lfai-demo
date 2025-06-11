import React from 'react';
import { SessionTimer } from '@/components/SessionTimer';
import { UsageLimitModal } from '@/components/UsageLimitModal';
import { SessionEndModal } from '@/components/SessionEndModal';
import { useSessionManager, UseSessionManagerOptions } from '@/hooks/useSessionManager';
import { useToast } from '@/hooks/use-toast';

interface SessionManagerProps extends UseSessionManagerOptions {
  children?: React.ReactNode;
  showTimer?: boolean;
  timerClassName?: string;
  onStartNewCall?: () => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  children,
  showTimer = true,
  timerClassName,
  onStartNewCall,
  ...sessionOptions
}) => {
  const { toast } = useToast();

  const {
    isSessionActive,
    sessionDuration,
    showUsageLimitModal,
    showSessionEndModal,
    usageLimitType,
    sessionEndReason,
    actions,
    handleSessionExpired,
    handleTimeWarning,
  } = useSessionManager({
    ...sessionOptions,
    onTimeWarning: (timeRemaining) => {
      toast({
        title: 'Session Time Warning',
        description: `Your session will end in ${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`,
        variant: 'destructive',
      });
      sessionOptions.onTimeWarning?.(timeRemaining);
    },
    onUsageLimitReached: (type) => {
      if (type === 'daily-limit') {
        toast({
          title: 'Daily Limit Reached',
          description: 'You have reached your daily limit of 3 avatar calls.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Session Time Limit',
          description: 'Your session has reached the 5-minute time limit.',
          variant: 'destructive',
        });
      }
      sessionOptions.onUsageLimitReached?.(type);
    },
  });

  return (
    <>
      {children}
      
      {/* Session Timer */}
      {showTimer && isSessionActive && (
        <div className="fixed top-4 right-4 z-40">
          <SessionTimer
            onSessionExpired={handleSessionExpired}
            onTimeWarning={handleTimeWarning}
            className={timerClassName}
          />
        </div>
      )}

      {/* Usage Limit Modal */}
      <UsageLimitModal
        isOpen={showUsageLimitModal}
        onClose={actions.closeUsageLimitModal}
        type={usageLimitType || 'daily-limit'}
      />

      {/* Session End Modal */}
      <SessionEndModal
        isOpen={showSessionEndModal}
        onClose={actions.closeSessionEndModal}
        onStartNewCall={onStartNewCall}
        sessionDuration={sessionDuration}
        reason={sessionEndReason || 'user-ended'}
      />
    </>
  );
};

// Export the hook for direct use
export { useSessionManager } from '@/hooks/useSessionManager';

// Export utility functions for external use
export {
  getUsageStats,
  canStartCall,
  formatTime,
  resetUsageData,
} from '@/utils/usageTracker';