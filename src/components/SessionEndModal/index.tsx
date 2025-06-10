import React, { useState, useEffect } from 'react';
import { getUsageStats, formatTime } from '@/utils/usageTracker';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Users } from 'lucide-react';

interface SessionEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNewCall?: () => void;
  sessionDuration?: number; // in seconds
  reason: 'time-limit' | 'user-ended' | 'error';
}

export const SessionEndModal: React.FC<SessionEndModalProps> = ({
  isOpen,
  onClose,
  onStartNewCall,
  sessionDuration = 0,
  reason
}) => {
  const [usageStats, setUsageStats] = useState(getUsageStats());

  useEffect(() => {
    if (isOpen) {
      setUsageStats(getUsageStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (reason) {
      case 'time-limit':
        return 'Session Time Limit Reached';
      case 'user-ended':
        return 'Call Ended';
      case 'error':
        return 'Call Ended Unexpectedly';
      default:
        return 'Call Ended';
    }
  };

  const getIcon = () => {
    switch (reason) {
      case 'time-limit':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'user-ended':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <Clock className="w-6 h-6 text-red-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const getMessage = () => {
    switch (reason) {
      case 'time-limit':
        return 'Your session has reached the 5-minute time limit. Thank you for using our avatar calling service!';
      case 'user-ended':
        return 'Your call has ended successfully. Thank you for using our avatar calling service!';
      case 'error':
        return 'Your call ended unexpectedly. This may be due to a connection issue or technical problem.';
      default:
        return 'Your call has ended. Thank you for using our avatar calling service!';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          {getIcon()}
          <h2 className="text-xl font-semibold text-gray-900">
            {getTitle()}
          </h2>
        </div>

        <div className="mb-6 space-y-4">
          <p className="text-gray-600">
            {getMessage()}
          </p>

          {/* Session Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Session Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-mono text-gray-900">
                  {formatTime(sessionDuration)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calls remaining today:</span>
                <span className="font-medium text-gray-900">
                  {usageStats.callsRemaining}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily limit:</span>
                <span className="text-gray-900">3 calls</span>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          {usageStats.callsRemaining > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">
                  You can start {usageStats.callsRemaining} more call{usageStats.callsRemaining !== 1 ? 's' : ''} today
                </span>
              </div>
            </div>
          )}

          {usageStats.callsRemaining === 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-900">
                  Daily limit reached
                </span>
              </div>
              <p className="text-sm text-orange-700">
                Your daily limit of 3 calls has been reached. Limit resets at midnight.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Close
          </Button>
          {usageStats.callsRemaining > 0 && onStartNewCall && (
            <Button
              onClick={() => {
                onClose();
                onStartNewCall();
              }}
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