import { TAVUS_API_KEY } from '@/config';
import { IConversation } from '@/types';
import { getGreetingForLanguage } from '@/constants/greetings';
import { AvatarUseCase, DEFAULT_AVATAR } from '@/constants/avatars';

interface CreateConversationOptions {
  language?: string;
  avatarUseCase?: AvatarUseCase;
}

export const createConversation = async ({
  language = 'english',
  avatarUseCase = DEFAULT_AVATAR
}: CreateConversationOptions = {}): Promise<IConversation> => {
  try {
    // Validate API key
    if (!TAVUS_API_KEY) {
      throw new Error('TAVUS_API_KEY is not defined. Make sure your .env file contains VITE_APP_TAVUS_API_KEY.');
    }
    // Handle both original implementation (language only) and new implementation (with avatarUseCase)
    let persona_id = 'pcabf8c842bb'; // Default Gloria persona ID
    let replica_id = 'rbb0f535dd'; // Default Gloria replica ID
    let greeting;
    let requestProperties: Record<string, string> = { language };
    
    if (avatarUseCase) {
      // New implementation with custom avatar
      persona_id = avatarUseCase.persona_id;
      replica_id = avatarUseCase.replica_id;
      greeting = getGreetingForLanguage(
        language,
        avatarUseCase.nameInGreeting,
        avatarUseCase.role
      );
      // Don't add avatarId to properties - API doesn't accept it
      // Just store the avatar information in state instead
    } else {
      // Original implementation - just language
      greeting = getGreetingForLanguage(language);
    }
    
    // Prepare the request payload for logging
    const requestPayload = {
      persona_id,
      replica_id,
      custom_greeting: greeting,
      properties: requestProperties,
    };
    
    console.log('Sending request to Tavus API with payload:', requestPayload);
    
    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      // Get the response content to provide more details about the error
      const errorText = await response.text();
      let errorDetails = '';
      
      try {
        // Try to parse the error as JSON if possible
        const errorJson = JSON.parse(errorText);
        errorDetails = JSON.stringify(errorJson, null, 2);
      } catch {
        // If it's not JSON, use the raw text
        errorDetails = errorText;
      }
      
      console.error(`API Error Response (${response.status}):`, errorDetails);
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Conversation Creation Error:', error);
    // Log more detailed info for debugging
    console.log('Request details:', {
      persona_id: avatarUseCase.persona_id,
      replica_id: avatarUseCase.replica_id,
      language,
      avatarId: avatarUseCase.id
    });
    throw error;
  }
};
