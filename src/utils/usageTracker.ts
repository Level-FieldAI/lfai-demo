// Usage tracking utility for managing daily call limits and session times

export interface UsageData {
  dailyCalls: number;
  lastCallDate: string;
  totalSessionTime: number; // in seconds
  lastSessionStart?: number; // timestamp
}

export interface UsageStats {
  callsRemaining: number;
  canStartCall: boolean;
  timeRemaining: number; // in seconds for current session
  isSessionActive: boolean;
}

const STORAGE_KEY = 'tavus_usage_data';
const MAX_DAILY_CALLS = 3;
const MAX_SESSION_TIME = 5 * 60; // 5 minutes in seconds

// Get current date string for comparison
const getCurrentDateString = (): string => {
  return new Date().toDateString();
};

// Get usage data from localStorage
export const getUsageData = (): UsageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as UsageData;
      
      // Reset daily calls if it's a new day
      if (data.lastCallDate !== getCurrentDateString()) {
        return {
          dailyCalls: 0,
          lastCallDate: getCurrentDateString(),
          totalSessionTime: 0,
        };
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error reading usage data:', error);
  }
  
  // Return default data
  return {
    dailyCalls: 0,
    lastCallDate: getCurrentDateString(),
    totalSessionTime: 0,
  };
};

// Save usage data to localStorage
export const saveUsageData = (data: UsageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving usage data:', error);
  }
};

// Check if user can start a new call
export const canStartCall = (): boolean => {
  const data = getUsageData();
  return data.dailyCalls < MAX_DAILY_CALLS;
};

// Start a new session
export const startSession = (): boolean => {
  if (!canStartCall()) {
    return false;
  }
  
  const data = getUsageData();
  const updatedData: UsageData = {
    ...data,
    dailyCalls: data.dailyCalls + 1,
    lastCallDate: getCurrentDateString(),
    lastSessionStart: Date.now(),
  };
  
  saveUsageData(updatedData);
  return true;
};

// End current session
export const endSession = (): void => {
  const data = getUsageData();
  
  if (data.lastSessionStart) {
    const sessionDuration = Math.floor((Date.now() - data.lastSessionStart) / 1000);
    const updatedData: UsageData = {
      ...data,
      totalSessionTime: data.totalSessionTime + sessionDuration,
      lastSessionStart: undefined,
    };
    
    saveUsageData(updatedData);
  }
};

// Get current usage statistics
export const getUsageStats = (): UsageStats => {
  const data = getUsageData();
  const callsRemaining = Math.max(0, MAX_DAILY_CALLS - data.dailyCalls);
  const isSessionActive = !!data.lastSessionStart;
  
  let timeRemaining = MAX_SESSION_TIME;
  if (isSessionActive && data.lastSessionStart) {
    const elapsed = Math.floor((Date.now() - data.lastSessionStart) / 1000);
    timeRemaining = Math.max(0, MAX_SESSION_TIME - elapsed);
  }
  
  return {
    callsRemaining,
    canStartCall: callsRemaining > 0,
    timeRemaining,
    isSessionActive,
  };
};

// Check if current session has exceeded time limit
export const isSessionExpired = (): boolean => {
  const stats = getUsageStats();
  return stats.isSessionActive && stats.timeRemaining <= 0;
};

// Get time until next day (for reset)
export const getTimeUntilReset = (): number => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Reset usage data (for testing purposes)
export const resetUsageData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};