import React, { useState, useCallback } from 'react';
import { Call } from '@/components/Call';
import { ConversationsPage } from '@/components/ConversationsPage';
import { useConversationMonitor } from '@/hooks/useConversationMonitor';
import { IConversation } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface CallWithConversationsProps {
  // Props that would be passed to the Call component
  [key: string]: any;
}

export const CallWithConversations: React.FC<CallWithConversationsProps> = (props) => {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showConversations, setShowConversations] = useState(false);
  const [completedConversations, setCompletedConversations] = useState<IConversation[]>([]);

  // Monitor the current conversation
  const { isCompleted, hasError } = useConversationMonitor({
    conversationId: currentConversationId || undefined,
    onConversationComplete: useCallback((completedConversation: IConversation) => {
      toast({
        title: 'Call Completed',
        description: `Conversation ${completedConversation.conversation_name || completedConversation.conversation_id} has ended.`,
      });
      
      setCompletedConversations(prev => {
        const exists = prev.some(c => c.conversation_id === completedConversation.conversation_id);
        if (!exists) {
          return [completedConversation, ...prev];
        }
        return prev.map(c => 
          c.conversation_id === completedConversation.conversation_id ? completedConversation : c
        );
      });
      
      // Automatically show conversations page when call completes
      setShowConversations(true);
    }, []),
    onConversationError: useCallback((errorConversation: IConversation) => {
      toast({
        title: 'Call Error',
        description: `Conversation ${errorConversation.conversation_name || errorConversation.conversation_id} encountered an error.`,
        variant: 'destructive',
      });
    }, []),
    enabled: !!currentConversationId,
  });

  const toggleConversationsView = () => {
    setShowConversations(!showConversations);
  };

  if (showConversations) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Conversations Dashboard</h1>
            <div className="flex gap-2">
              {completedConversations.length > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {completedConversations.length} completed call{completedConversations.length !== 1 ? 's' : ''}
                </span>
              )}
              <Button onClick={toggleConversationsView} variant="outline">
                Back to Call
              </Button>
            </div>
          </div>
        </div>
        
        <ConversationsPage 
          autoRefresh={true}
          refreshInterval={5000}
          onConversationSelect={(selectedConversation) => {
            console.log('Selected conversation:', selectedConversation);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tavus Video Call</h1>
          <div className="flex gap-2 items-center">
            {currentConversationId && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Call Status: 
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isCompleted ? 'bg-blue-100 text-blue-800' :
                  hasError ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {isCompleted ? 'Completed' : hasError ? 'Error' : 'Active'}
                </span>
              </div>
            )}
            
            {completedConversations.length > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {completedConversations.length} completed
              </span>
            )}
            
            <Button onClick={toggleConversationsView} variant="outline">
              View Conversations
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Call {...props} />
      </div>
      
      {/* Show recent completed conversations as a sidebar or notification */}
      {completedConversations.length > 0 && !showConversations && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <div className="bg-white rounded-lg shadow-lg border p-4">
            <h3 className="font-medium text-gray-900 mb-2">Recent Completed Calls</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {completedConversations.slice(0, 3).map((conv) => (
                <div key={conv.conversation_id} className="text-sm">
                  <div className="font-medium text-gray-800 truncate">
                    {conv.conversation_name || 'Unnamed Call'}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {new Date(conv.ended_at || conv.updated_at || conv.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            {completedConversations.length > 3 && (
              <div className="text-xs text-gray-500 mt-2">
                +{completedConversations.length - 3} more
              </div>
            )}
            <Button 
              onClick={toggleConversationsView} 
              size="sm" 
              className="w-full mt-2"
            >
              View All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};