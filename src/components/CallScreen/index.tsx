import { useEffect } from 'react';
import { useDaily } from '@daily-co/daily-react';
import { IConversation } from '@/types';
import { CameraSettings } from '../CameraSettings';
import { Call } from '../Call';

export const CallScreen = ({
  conversation,
  handleEnd,
  isMobile
}: {
  conversation: IConversation,
  handleEnd: () => void,
  isMobile: boolean
}) => {
  const daily = useDaily();

  useEffect(() => {
    if (conversation && daily) {
      const { conversation_url } = conversation;
      
      // Calculate dimensions for 9:16 aspect ratio on mobile
      const joinOptions: any = {
        url: conversation_url,
      };
      
      // Apply 9:16 aspect ratio on mobile using Daily.co properties
      if (isMobile) {
        // Set the iframe style to have a 9:16 aspect ratio
        joinOptions.iframeStyle = {
          width: '100%',
          height: '100%',
          aspectRatio: '9/16',
          maxWidth: '100%'
        };
        
        // Set video fit to "cover" to zoom in on the avatar
        joinOptions.dailyConfig = {
          // This ensures the video fills the container and zooms in on the person
          videoFit: 'cover'
        };
      }
      
      daily.join(joinOptions);
    }
  }, [daily, conversation, isMobile]);

  const handleLeave = async () => {
    await daily?.leave();
    handleEnd();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Video area - takes most of the space */}
      <div className="flex-1 min-h-0 relative">
        <Call />
      </div>
      
      {/* Camera settings - fixed at bottom */}
      <div className={`flex-shrink-0 ${isMobile ? 'pb-2' : 'pb-4'}`}>
        <CameraSettings
          actionLabel='Leave Call'
          onAction={handleLeave}
        />
      </div>
    </div>
  );
};
