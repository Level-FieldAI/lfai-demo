import { TAVUS_API_KEY } from '@/config';
import { IReplicaInfo } from '@/types';

export const getReplicaInfo = async (replicaId: string): Promise<IReplicaInfo> => {
  try {
    const response = await fetch(`https://tavusapi.com/v2/replicas/${replicaId}`, {
      method: 'GET',
      headers: {
        'x-api-key': TAVUS_API_KEY,
      },
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