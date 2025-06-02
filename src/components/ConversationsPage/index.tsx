import React, { useState, useEffect } from 'react';
import { getConversations, getConversation } from '@/api';
import { IConversation, ConversationStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ConversationsPageProps {
  onConversationSelect?: (conversation: IConversation) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const ConversationsPage: React.FC<ConversationsPageProps> = ({
  onConversationSelect,
  autoRefresh = false,
  refreshInterval = 5000,
}) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchConversations = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const response = await getConversations({
        page,
        page_size: 20,
        status: statusFilter || undefined,
      });
      
      setConversations(response.conversations);
      setTotalCount(response.total_count);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch conversations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId: string) => {
    try {
      setLoadingDetails(true);
      const conversation = await getConversation(conversationId);
      setSelectedConversation(conversation);
      onConversationSelect?.(conversation);
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch conversation details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    fetchConversationDetails(conversationId);
  };

  const handleRefresh = () => {
    fetchConversations(true);
    if (selectedConversationId) {
      fetchConversationDetails(selectedConversationId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case ConversationStatus.ACTIVE:
        return 'text-green-600 bg-green-100';
      case ConversationStatus.ENDED:
        return 'text-blue-600 bg-blue-100';
      case ConversationStatus.ERROR:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [page, statusFilter]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchConversations(false); // Silent refresh
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, page, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tavus Conversations</h1>
        
        <div className="flex flex-wrap gap-4 items-center">
          <Button onClick={handleRefresh} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="error">Error</option>
          </select>
          
          {autoRefresh && (
            <span className="text-sm text-gray-500">
              Auto-refreshing every {refreshInterval / 1000}s
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Conversations ({totalCount})
            </h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No conversations found</div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.conversation_id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversationId === conversation.conversation_id
                      ? 'bg-blue-50 border-blue-200'
                      : ''
                  }`}
                  onClick={() => handleConversationClick(conversation.conversation_id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.conversation_name || conversation.conversation_id}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        conversation.status
                      )}`}
                    >
                      {conversation.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Created: {formatDate(conversation.created_at)}</p>
                    <p className="truncate">ID: {conversation.conversation_id}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {totalCount > 20 && (
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil(totalCount / 20)}
              </span>
              
              <Button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(totalCount / 20)}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Conversation Details */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Conversation Details</h2>
          </div>
          
          <div className="p-4">
            {loadingDetails ? (
              <div className="text-center text-gray-500">Loading details...</div>
            ) : selectedConversation ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conversation ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                    {selectedConversation.conversation_id}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedConversation.conversation_name || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      selectedConversation.status
                    )}`}
                  >
                    {selectedConversation.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedConversation.created_at)}
                  </p>
                </div>
                
                {selectedConversation.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Updated At
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedConversation.updated_at)}
                    </p>
                  </div>
                )}
                
                {selectedConversation.ended_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ended At
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedConversation.ended_at)}
                    </p>
                  </div>
                )}
                
                {selectedConversation.duration !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDuration(selectedConversation.duration)}
                    </p>
                  </div>
                )}
                
                {selectedConversation.participant_count !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Participants
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedConversation.participant_count}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Replica ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedConversation.replica_id || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Persona ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedConversation.persona_id || 'N/A'}
                  </p>
                </div>
                
                {selectedConversation.conversation_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conversation URL
                    </label>
                    <a
                      href={selectedConversation.conversation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {selectedConversation.conversation_url}
                    </a>
                  </div>
                )}
                
                {selectedConversation.recording_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recording URL
                    </label>
                    <a
                      href={selectedConversation.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {selectedConversation.recording_url}
                    </a>
                  </div>
                )}
                
                {selectedConversation.properties && Object.keys(selectedConversation.properties).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Properties
                    </label>
                    <pre className="text-xs text-gray-900 bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(selectedConversation.properties, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Select a conversation to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};