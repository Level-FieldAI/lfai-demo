import { TAVUS_API_KEY } from '@/config';
import { IConversation } from '@/types';
import { getGreetingForLanguage } from '@/constants/greetings';

export const createConversation = async (language: string = 'english'): Promise<IConversation> => {
  try {
    const greeting = getGreetingForLanguage(language);
    
    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY,
      },
      body: JSON.stringify({
        persona_id: 'pcabf8c842bb',
        replica_id: 'rbb0f535dd',
        custom_greeting: greeting,
        properties: {
          language: language,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
