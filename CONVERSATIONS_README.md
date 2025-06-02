# Tavus Conversations Integration

This implementation adds conversation retrieval and monitoring functionality to the Tavus video calling application. It allows you to pull conversation details once calls complete and provides a comprehensive dashboard for managing conversations.

## Features

### 1. Conversation Retrieval API
- **Get specific conversation**: `GET /conversations/{conversation_id}`
- **List all conversations**: `GET /conversations` with pagination and filtering
- Automatic error handling and retry logic
- TypeScript support with proper type definitions

### 2. Real-time Conversation Monitoring
- Automatic polling of conversation status during active calls
- Callbacks for conversation completion and error events
- Configurable polling intervals
- Automatic cleanup when conversations end

### 3. Conversations Dashboard
- Auto-refreshing list of all conversations
- Detailed conversation information display
- Status filtering (active, ended, error)
- Pagination for large conversation lists
- Manual conversation fetching by ID

### 4. Integrated App Experience
- Seamless integration with existing call flow
- Automatic conversation tracking during calls
- Floating notifications for completed calls
- Easy navigation between call and conversations views

## Components

### ConversationsPage
Main dashboard component for viewing and managing conversations.

```tsx
import { ConversationsPage } from '@/components/ConversationsPage';

<ConversationsPage 
  autoRefresh={true}
  refreshInterval={5000}
  onConversationSelect={(conversation) => {
    console.log('Selected:', conversation);
  }}
/>
```

**Props:**
- `autoRefresh?: boolean` - Enable automatic refresh (default: false)
- `refreshInterval?: number` - Refresh interval in ms (default: 5000)
- `onConversationSelect?: (conversation: IConversation) => void` - Callback when conversation is selected

### AppWithConversations
Enhanced version of the main app with conversations integration.

```tsx
import AppWithConversations from '@/components/AppWithConversations';

// Use this instead of the regular App component
<AppWithConversations />
```

### ConversationsDemo
Standalone demo component showing all conversation features.

```tsx
import { ConversationsDemo } from '@/components/ConversationsDemo';

<ConversationsDemo />
```

## Hooks

### useConversationMonitor
Hook for monitoring conversation status changes.

```tsx
import { useConversationMonitor } from '@/hooks/useConversationMonitor';

const { conversation, isCompleted, hasError, refreshConversation } = useConversationMonitor({
  conversationId: 'conv_12345',
  onConversationComplete: (conversation) => {
    console.log('Call completed:', conversation);
  },
  onConversationError: (conversation) => {
    console.log('Call error:', conversation);
  },
  pollInterval: 3000,
  enabled: true,
});
```

**Options:**
- `conversationId?: string` - ID of conversation to monitor
- `onConversationComplete?: (conversation: IConversation) => void` - Called when conversation ends
- `onConversationError?: (conversation: IConversation) => void` - Called when conversation errors
- `pollInterval?: number` - Polling interval in ms (default: 3000)
- `enabled?: boolean` - Enable/disable monitoring (default: true)

## API Functions

### getConversation
Fetch details for a specific conversation.

```tsx
import { getConversation } from '@/api';

const conversation = await getConversation('conv_12345');
```

### getConversations
List conversations with pagination and filtering.

```tsx
import { getConversations } from '@/api';

const response = await getConversations({
  page: 1,
  page_size: 20,
  status: 'ended'
});

console.log(response.conversations); // Array of conversations
console.log(response.total_count);   // Total number of conversations
```

**Options:**
- `page?: number` - Page number (default: 1)
- `page_size?: number` - Items per page (default: 20)
- `status?: string` - Filter by status ('active', 'ended', 'error')

## Types

### IConversation (Extended)
```tsx
export type IConversation = {
  conversation_id: string;
  conversation_name: string;
  status: ConversationStatus;
  conversation_url: string;
  replica_id: string | null;
  persona_id: string | null;
  created_at: string;
  updated_at?: string;
  ended_at?: string;
  duration?: number;
  participant_count?: number;
  recording_url?: string;
  properties?: Record<string, any>;
};
```

## Usage Examples

### 1. Basic Conversations Dashboard
```tsx
import { ConversationsPage } from '@/components/ConversationsPage';

function MyApp() {
  return (
    <div>
      <h1>My Conversations</h1>
      <ConversationsPage autoRefresh={true} />
    </div>
  );
}
```

### 2. Monitor Active Call
```tsx
import { useConversationMonitor } from '@/hooks/useConversationMonitor';
import { toast } from '@/hooks/use-toast';

function CallComponent({ conversationId }) {
  const { isCompleted, hasError } = useConversationMonitor({
    conversationId,
    onConversationComplete: (conversation) => {
      toast({
        title: 'Call Completed',
        description: `Duration: ${conversation.duration}s`,
      });
    },
  });

  return (
    <div>
      <p>Status: {isCompleted ? 'Completed' : hasError ? 'Error' : 'Active'}</p>
    </div>
  );
}
```

### 3. Fetch Specific Conversation
```tsx
import { getConversation } from '@/api';
import { useState, useEffect } from 'react';

function ConversationDetails({ conversationId }) {
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    getConversation(conversationId)
      .then(setConversation)
      .catch(console.error);
  }, [conversationId]);

  if (!conversation) return <div>Loading...</div>;

  return (
    <div>
      <h2>{conversation.conversation_name}</h2>
      <p>Status: {conversation.status}</p>
      <p>Duration: {conversation.duration}s</p>
    </div>
  );
}
```

## Running the Demo

### Option 1: Conversations Demo Only
```bash
# Start the conversations demo
npm run dev -- --config vite.config.ts conversations-demo.html
```

### Option 2: Full App with Conversations
Replace the import in `src/main.tsx`:
```tsx
// Change this:
import App from './App.tsx'

// To this:
import AppWithConversations from '@/components/AppWithConversations'

// And render:
<AppWithConversations />
```

### Option 3: Use Alternative Main File
```bash
# Copy the alternative main file
cp src/main-with-conversations.tsx src/main.tsx
npm run dev
```

## Environment Setup

Make sure your `.env` file contains the Tavus API key:
```
VITE_APP_TAVUS_API_KEY=your_tavus_api_key_here
```

## API Endpoints

The implementation uses these Tavus API endpoints:

1. **GET /conversations/{conversation_id}**
   - Retrieves details for a specific conversation
   - Returns full conversation object with metadata

2. **GET /conversations**
   - Lists all conversations with pagination
   - Supports filtering by status
   - Returns paginated response with total count

Both endpoints require authentication via the `x-api-key` header.

## Error Handling

All API functions include comprehensive error handling:
- Network errors are caught and logged
- API errors include response details
- User-friendly error messages via toast notifications
- Automatic retry logic for transient failures

## Performance Considerations

- Auto-refresh can be disabled to reduce API calls
- Polling intervals are configurable
- Pagination prevents loading too many conversations at once
- Conversation monitoring automatically stops when calls end
- Component cleanup prevents memory leaks

## Customization

The components are designed to be flexible and customizable:
- All styling uses Tailwind CSS classes
- Components accept callback props for custom behavior
- API functions can be used independently
- Hooks provide low-level access to conversation data

This implementation provides a complete solution for managing Tavus conversations with real-time monitoring and a user-friendly interface.