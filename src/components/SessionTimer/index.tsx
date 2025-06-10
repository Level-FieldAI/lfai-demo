import React, { useState, useEffect } from 'react';
import { getUsageStats, isSessionExpired, formatTime } from '@/utils/usageTracker';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionTimerProps {
  onSessionExpired?: () => void;
  onTimeWarning?: (timeRemaining: number) => void;
  className?: string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  onSessionExpired,
  onTimeWarning,
  className
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const stats = getUsageStats();
      setTimeRemaining(stats.timeRemaining);
      setIsActive(stats.isSessionActive);

      // Check if session has expired
      if (isSessionExpired() && stats.isSessionActive) {
        onSessionExpired?.();
        return;
      }

      // Warning at 1 minute remaining
      if (stats.timeRemaining <= 60 && stats.timeRemaining > 0 && !hasWarned) {
        setHasWarned(true);
        onTimeWarning?.(stats.timeRemaining);
      }

      // Reset warning flag when time goes above 1 minute
      if (stats.timeRemaining > 60) {
        setHasWarned(false);
      }
    };

    // Update immediately
    updateTimer();

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [onSessionExpired, onTimeWarning, hasWarned]);

  if (!isActive) {
    return null;
  }

  const isWarning = timeRemaining <= 60 && timeRemaining > 0;
  const isCritical = timeRemaining <= 30 && timeRemaining > 0;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
      {
        "bg-green-100 text-green-800": timeRemaining > 60,
        "bg-yellow-100 text-yellow-800": isWarning && !isCritical,
        "bg-red-100 text-red-800": isCritical,
      },
      className
    )}>
      {isCritical ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span>
        {timeRemaining > 0 ? formatTime(timeRemaining) : "00:00"}
      </span>
      {isWarning && (
        <span className="text-xs">
          remaining
        </span>
      )}
    </div>
  );
};