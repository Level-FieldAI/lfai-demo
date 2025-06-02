import { DailyVideo } from '@daily-co/daily-react';
import { cn } from '@/lib/utils';

interface VideoProps {
  id: string;
  className?: string;
}

export const Video = ({ id, className }: VideoProps) => {
  return (
    <DailyVideo
      sessionId={id}      type="video"      className={cn('w-full h-full object-cover rounded-md', className)}
    />
  );
};