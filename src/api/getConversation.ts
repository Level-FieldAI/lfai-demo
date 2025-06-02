import { TAVUS_API_KEY } from '@/config';
import { IConversation } from '@/types';

export const getConversation = async (conversationId: string): Promise<IConversation> => {
  try {
    if (!TAVUS_API_KEY) {
      throw new Error('TAVUS_API_KEY is not defined. Make sure your .env file contains VITE_APP_TAVUS_API_KEY.');
    }

    const response = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}`, {
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
    console.error('Get Conversation Error:', error);
    throw error;
  }
};