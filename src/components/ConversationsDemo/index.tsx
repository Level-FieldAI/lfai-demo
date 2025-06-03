import React, { useState } from 'react';
import { ConversationsPage } from '@/components/ConversationsPage';
import { getConversation } from '@/api';
import { IConversation } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export const ConversationsDemo: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [conversationId, setConversationId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchSpecificConversation = async () => {
    if (!conversationId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a conversation ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const conversation = await getConversation(conversationId.trim());
      setSelectedConversation(conversation);
      toast({
        title: 'Success',
        description: 'Conversation fetched successfully',
      });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch conversation. Please check the ID and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation: IConversation) => {
    setSelectedConversation(conversation);
    setConversationId(conversation.conversation_id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
             Level-FieldAI Conversations Demo
          </h1>
          <p className="text-gray-600 mb-6">
            This demo shows how to retrieve and display Level-FieldAI conversations using the API.
          </p>
          
          {/* Manual conversation fetch */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 max-w-md">
              <label htmlFor="conversationId" className="block text-sm font-medium text-gray-700 mb-1">
                Fetch Specific Conversation
              </label>
              <input
                id="conversationId"
                type="text"
                value={conversationId}
                onChange={(e) => setConversationId(e.target.value)}
                placeholder="Enter conversation ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button 
              onClick={handleFetchSpecificConversation}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Fetch'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ConversationsPage 
          autoRefresh={true}
          refreshInterval={10000}
          onConversationSelect={handleConversationSelect}
        />

        {/* Selected conversation details */}
        {selectedConversation && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selected Conversation Details
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm text-gray-800 overflow-x-auto">
                {JSON.stringify(selectedConversation, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* API Information */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            API Endpoints Used
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">
                GET /conversations
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                List all conversations with pagination and filtering options.
              </p>
              <code className="text-xs bg-white p-2 rounded block">
                GET https://tavusapi.com/v2/conversations?page=1&page_size=20&status=ended
              </code>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">
                GET /conversations/{'{conversation_id}'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Get details about a specific conversation by ID.
              </p>
              <code className="text-xs bg-white p-2 rounded block">
                GET https://tavusapi.com/v2/conversations/conv_12345
              </code>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">
              Features Demonstrated
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Auto-refreshing conversations list</li>
              <li>• Conversation status filtering</li>
              <li>• Detailed conversation information display</li>
              <li>• Manual conversation fetching by ID</li>
              <li>• Real-time conversation monitoring</li>
              <li>• Pagination for large conversation lists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};