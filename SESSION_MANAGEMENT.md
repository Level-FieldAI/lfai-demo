# Session Management & Usage Limits

This document describes the session management and usage limit features implemented in the Level-FieldAI Demo application.

## Features

### 1. Session Time Limits
- **Duration**: Each avatar call session is limited to 5 minutes
- **Timer Display**: A countdown timer shows remaining session time during calls
- **Auto-End**: Sessions automatically end when the time limit is reached
- **Warnings**: Users receive warnings when session time is running low

### 2. Daily Call Limits
- **Limit**: Users can make a maximum of 3 avatar calls per day
- **Reset**: The daily limit resets at midnight (local time)
- **Tracking**: Usage is tracked in browser localStorage
- **Visual Indicators**: Usage stats are displayed on the welcome screen

### 3. User Interface Components

#### SessionManager
- Main component that wraps the entire application
- Manages session state and displays modals
- Handles session start/end events

#### SessionTimer
- Displays countdown timer during active sessions
- Shows time remaining in MM:SS format
- Provides visual warnings when time is running low

#### UsageLimitModal
- Shown when daily or session limits are reached
- Displays relevant information and next available time

#### SessionEndModal
- Appears when a session ends (time limit, user action, or error)
- Shows session summary and remaining daily usage

#### UsageStats
- Displays current usage statistics on welcome screen
- Shows calls remaining and session time limit
- Indicates when daily limit is reached

## Implementation Details

### Data Storage
- Usage data is stored in browser localStorage
- Data includes daily call count, session history, and current session info
- Data persists across browser sessions but is device-specific

### Session Tracking
```typescript
interface UsageData {
  dailyCallCount: number;
  lastResetDate: string;
  sessions: SessionRecord[];
  currentSession: CurrentSession | null;
}
```

### Key Functions

#### `canStartCall()`
Checks if user can start a new call based on daily limits.

#### `startSession()`
Initiates a new session and increments daily call count.

#### `endSession(sessionId, reason)`
Ends the current session and records duration.

#### `isSessionExpired()`
Checks if current session has exceeded time limit.

#### `getUsageStats()`
Returns current usage statistics for UI display.

## Usage Examples

### Basic Integration
```tsx
<SessionManager
  onStartNewCall={() => setScreen('welcome')}
  showTimer={true}
  onSessionStart={() => console.log('Session started')}
  onSessionEnd={(reason, duration) => console.log('Session ended')}
  onUsageLimitReached={(type) => console.log('Limit reached')}
  autoEndOnTimeLimit={true}
>
  <YourAppContent />
</SessionManager>
```

### Checking Usage Before Starting
```tsx
const handleStart = async () => {
  if (!canStartCall()) {
    // Show limit reached message
    return;
  }
  
  // Proceed with starting conversation
  const sessionId = startSession();
  // ... rest of start logic
};
```

## Testing

A test utility is available in development mode:

```javascript
// In browser console:
testUsageTracker.reset(); // Reset all usage data
testUsageTracker.testDailyLimit(); // Test daily limit functionality
testUsageTracker.testSessionTimeLimit(); // Test session time limit
testUsageTracker.showStatus(); // Show current usage stats
testUsageTracker.simulateSession(3); // Simulate a 3-minute session
```

## Configuration

### Time Limits
- Session time limit: 5 minutes (300 seconds)
- Daily call limit: 3 calls
- Warning threshold: 30 seconds before session end

### Customization
To modify limits, update the constants in `src/utils/usageTracker.ts`:

```typescript
const SESSION_TIME_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds
const DAILY_CALL_LIMIT = 3; // Maximum calls per day
const TIME_WARNING_THRESHOLD = 30; // Warning at 30 seconds remaining
```

## Error Handling

The system handles various error scenarios:
- Network failures during session start/end
- Browser storage limitations
- Invalid session states
- Clock changes (for daily reset logic)

## Privacy & Data

- All usage data is stored locally in the user's browser
- No usage data is transmitted to external servers
- Users can clear usage data by clearing browser storage
- Data is automatically cleaned up after extended periods of inactivity