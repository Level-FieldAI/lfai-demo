
import { useEffect } from 'react';
import { useDaily } from '@daily-co/daily-react';
import { useLocalSessionId } from '@daily-co/daily-react';
import { CameraSettings } from '../CameraSettings';
import { Video } from '../Video';

export const HairCheckScreen = ({
  handleJoin,
  handleEnd,
  isMobile
}:
  {
    handleJoin: () => void,
    handleEnd: () => void,
    isMobile: boolean
  }
) => {
  const localSessionId = useLocalSessionId();
  const daily = useDaily();

  useEffect(() => {
    if (daily) {
      const cameraOptions: any = {
        startVideoOff: false,
        startAudioOff: false
      };
      
      // Apply 9:16 aspect ratio on mobile using Daily.co properties
      if (isMobile) {
        cameraOptions.iframeStyle = {
          width: '100%',
          height: '100%',
          aspectRatio: '9/16',
          maxWidth: '100%'
        };
        
        // Set video fit to "cover" to zoom in on the avatar
        cameraOptions.dailyConfig = {
          // This ensures the video fills the container and zooms in on the person
          videoFit: 'cover'
        };
      }
      
      daily?.startCamera(cameraOptions);
    }
  }, [daily, localSessionId, isMobile]);

  return <div>
    <Video id={localSessionId} className='max-h-[70vh]' />
    <CameraSettings
      actionLabel='Join Call'
      onAction={handleJoin}
      cancelLabel='Cancel'
      onCancel={handleEnd}
    />
  </div>
};