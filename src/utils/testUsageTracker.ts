import { 
  resetUsageData, 
  canStartCall, 
  startSession, 
  endSession, 
  getUsageStats, 
  isSessionExpired,
  formatTime 
} from './usageTracker';

// Test utility functions for development and debugging
export const testUsageTracker = {
  // Reset all data for testing
  reset: () => {
    resetUsageData();
    console.log('Usage data reset');
  },

  // Test daily limit
  testDailyLimit: () => {
    console.log('Testing daily limit...');
    resetUsageData();
    
    // Start 3 sessions to reach daily limit
    for (let i = 1; i <= 3; i++) {
      if (canStartCall()) {
        const sessionId = startSession();
        console.log(`Started session ${i}: ${sessionId}`);
        endSession(sessionId, 'user-ended');
        console.log(`Ended session ${i}`);
      }
    }
    
    // Try to start a 4th session
    const canStart4th = canStartCall();
    console.log(`Can start 4th session: ${canStart4th}`);
    
    const stats = getUsageStats();
    console.log('Final stats:', stats);
  },

  // Test session time limit
  testSessionTimeLimit: () => {
    console.log('Testing session time limit...');
    resetUsageData();
    
    if (canStartCall()) {
      const sessionId = startSession();
      console.log(`Started session: ${sessionId}`);
      
      // Simulate session running for 6 minutes (over limit)
      const sessionData = JSON.parse(localStorage.getItem('usage_data') || '{}');
      if (sessionData.currentSession) {
        sessionData.currentSession.startTime = Date.now() - (6 * 60 * 1000); // 6 minutes ago
        localStorage.setItem('usage_data', JSON.stringify(sessionData));
      }
      
      const expired = isSessionExpired();
      console.log(`Session expired: ${expired}`);
      
      if (expired) {
        endSession(sessionId, 'time-limit');
        console.log('Session ended due to time limit');
      }
    }
  },

  // Show current status
  showStatus: () => {
    const stats = getUsageStats();
    console.log('Current usage stats:', {
      callsRemaining: stats.callsRemaining,
      timeRemaining: formatTime(stats.timeRemaining),
      isSessionActive: stats.isSessionActive,
    });
  },

  // Simulate a complete session
  simulateSession: (durationMinutes: number = 3) => {
    console.log(`Simulating ${durationMinutes}-minute session...`);
    
    if (!canStartCall()) {
      console.log('Cannot start session - daily limit reached');
      return;
    }
    
    const sessionId = startSession();
    console.log(`Session started: ${sessionId}`);
    
    // Simulate session duration
    setTimeout(() => {
      endSession(sessionId, 'user-ended');
      console.log(`Session ended after ${durationMinutes} minutes`);
      testUsageTracker.showStatus();
    }, durationMinutes * 60 * 1000);
  }
};

// Make it available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testUsageTracker = testUsageTracker;
}