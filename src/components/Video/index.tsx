
import { useVideoTrack, DailyVideo } from '@daily-co/daily-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const Video = ({ id, className }: { id: string, className?: string }) => {
  const videoState = useVideoTrack(id);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <DailyVideo
      automirror
      sessionId={id}
      type='video'
      // Set fit to "cover" to ensure video fills the container
      fit="cover"
      className={cn('h-auto bg-slate-500/80 rounded-md object-cover', className, {
        hidden: videoState.isOff,
      })}
    />
  );
}