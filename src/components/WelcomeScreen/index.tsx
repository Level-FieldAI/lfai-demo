import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { getReplicaInfo } from '@/api';
import { IReplicaInfo } from '@/types';

export const WelcomeScreen = ({ onStart, loading }: { onStart: () => void, loading: boolean }) => {
  const [replicaInfo, setReplicaInfo] = useState<IReplicaInfo | null>(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(true);

  useEffect(() => {
    const fetchReplicaInfo = async () => {
      try {
        // Using the replica_id from createConversation.ts
        const replicaId = 'rbb0f535dd';
        const info = await getReplicaInfo(replicaId);
        setReplicaInfo(info);
      } catch (error) {
        console.error('Error fetching replica info:', error);
      } finally {
        setThumbnailLoading(false);
      }
    };

    fetchReplicaInfo();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-6 md:gap-10 p-4 md:p-10 overflow-y-auto py-8'>
      <img src="/logo.png" alt="WhitegloveAI Logo" className="w-36 md:w-48 mb-2 md:mb-4" />
      
      {thumbnailLoading ? (
        <div className="w-full max-w-lg aspect-[9/16] bg-gray-200 animate-pulse rounded-md"></div>
      ) : replicaInfo?.thumbnail_video_url ? (
        <div className="relative w-full max-w-lg overflow-hidden rounded-md shadow-lg aspect-[9/16]">
          <video
            src={replicaInfo.thumbnail_video_url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            poster="/logo.png"
            playsInline
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-lg md:text-xl font-medium">{replicaInfo.replica_name}</p>
          </div>
        </div>
      ) : null}
      
      <h1 className='text-2xl md:text-4xl text-center font-bold'>
        The Future of AI Interaction Starts Now
      </h1>
      <h2 className='text-lg md:text-xl text-center text-gray-700'>Dive Into an Engaging, Intelligent, and Fun Experience</h2>
      <Button className="mt-2 px-6 py-2 text-lg" onClick={onStart}>
        {loading ? 'Loading...' : 'Start Conversation'}
      </Button>
    </div>
  );
};
