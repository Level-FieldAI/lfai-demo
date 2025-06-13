import React, { useState, useEffect } from 'react';
import { getUsageStats, getTimeUntilReset, formatTime } from '@/utils/usageTracker';
import { Users, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UsageStatsProps {
  className?: string;
  showTimeUntilReset?: boolean;
}

export const UsageStats: React.FC<UsageStatsProps> = ({
  className,
  showTimeUntilReset = false
}) => {
  const [stats, setStats] = useState(getUsageStats());
  const [timeUntilReset, setTimeUntilReset] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      setStats(getUsageStats());
      if (showTimeUntilReset) {
        setTimeUntilReset(getTimeUntilReset());
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [showTimeUntilReset]);

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg p-4", className)}>
      <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Daily Usage
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Calls remaining:</span>
          <span className={cn("font-medium", {
            "text-green-600": stats.callsRemaining > 1,
            "text-yellow-600": stats.callsRemaining === 1,
            "text-red-600": stats.callsRemaining === 0,
          })}>
            {stats.callsRemaining} / 3
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Session limit:</span>
          <span className="font-medium text-gray-900">5 minutes</span>
        </div>

        {showTimeUntilReset && stats.callsRemaining === 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Resets in:</span>
            </div>
            <div className="font-mono text-sm text-gray-700">
              {formatTime(timeUntilReset)}
            </div>
          </div>
        )}

        {stats.callsRemaining === 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="text-xs text-red-700">
              Daily limit reached. Limit resets at midnight.
            </p>
          </div>
        )}

        {stats.callsRemaining === 1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
            <p className="text-xs text-yellow-700">
              Last call remaining for today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};