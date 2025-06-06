import { DailyVideo } from '@daily-co/daily-react';
import { cn } from '@/lib/utils';

interface VideoProps {
  id: string;
  className?: string;
}

export const Video = ({ id, className }: VideoProps) => {
  return (
    <div className={cn('video-container', className)}>
      <DailyVideo
        sessionId={id}
        type="video"
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  );
};