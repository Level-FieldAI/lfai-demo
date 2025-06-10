import React, { useState, useEffect } from 'react';
import { getUsageStats, getTimeUntilReset, formatTime } from '@/utils/usageTracker';
import { Button } from '@/components/ui/button';
import { Clock, Users, RefreshCw } from 'lucide-react';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'daily-limit' | 'session-limit';
}

export const UsageLimitModal: React.FC<UsageLimitModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  const [timeUntilReset, setTimeUntilReset] = useState(0);
  const [usageStats, setUsageStats] = useState(getUsageStats());

  useEffect(() => {
    if (!isOpen) return;

    const updateStats = () => {
      setUsageStats(getUsageStats());
      setTimeUntilReset(getTimeUntilReset());
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isDailyLimit = type === 'daily-limit';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          {isDailyLimit ? (
            <Users className="w-6 h-6 text-red-500" />
          ) : (
            <Clock className="w-6 h-6 text-orange-500" />
          )}
          <h2 className="text-xl font-semibold text-gray-900">
            {isDailyLimit ? 'Daily Limit Reached' : 'Session Time Limit'}
          </h2>
        </div>

        <div className="mb-6">
          {isDailyLimit ? (
            <div className="space-y-3">
              <p className="text-gray-600">
                You've reached your daily limit of 3 avatar calls. This helps ensure fair usage for all users.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Resets in:</span>
                </div>
                <div className="text-2xl font-mono text-blue-700">
                  {formatTime(timeUntilReset)}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>• Daily limit: 3 calls per day</p>
                <p>• Calls used today: {3 - usageStats.callsRemaining} / 3</p>
                <p>• Limit resets at midnight</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600">
                Your session has reached the 5-minute time limit. This helps manage server resources and ensures quality for all users.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-900">Session Duration:</span>
                </div>
                <div className="text-2xl font-mono text-orange-700">
                  5:00 minutes
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>• Maximum session time: 5 minutes</p>
                <p>• Calls remaining today: {usageStats.callsRemaining}</p>
                <p>• You can start a new call if you have calls remaining</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1"
            variant="outline"
          >
            Close
          </Button>
          {!isDailyLimit && usageStats.callsRemaining > 0 && (
            <Button
              onClick={onClose}
              className="flex-1"
            >
              Start New Call
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};