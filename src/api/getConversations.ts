import { TAVUS_API_KEY } from '@/config';
import { IConversation } from '@/types';

interface GetConversationsResponse {
  conversations: IConversation[];
  total_count: number;
  page: number;
  page_size: number;
}

interface GetConversationsOptions {
  page?: number;
  page_size?: number;
  status?: string;
}

export const getConversations = async (options: GetConversationsOptions = {}): Promise<GetConversationsResponse> => {
  try {
    if (!TAVUS_API_KEY) {
      throw new Error('TAVUS_API_KEY is not defined. Make sure your .env file contains VITE_APP_TAVUS_API_KEY.');
    }

    const { page = 1, page_size = 20, status } = options;
    
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`https://tavusapi.com/v2/conversations?${params.toString()}`, {
      method: 'GET',
      headers: {
        'x-api-key': TAVUS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails = '';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = JSON.stringify(errorJson, null, 2);
      } catch {
        errorDetails = errorText;
      }
      
      console.error(`API Error Response (${response.status}):`, errorDetails);
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get Conversations Error:', error);
    throw error;
  }
};