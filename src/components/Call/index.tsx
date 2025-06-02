import { useState, useEffect } from 'react';
import { DailyAudio, useParticipantIds, useLocalSessionId } from '@daily-co/daily-react';
import { Minimize, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video } from '../Video';
import { Button } from '../ui/button';

interface CallProps {
  conversationId?: string;
  onConversationStart?: (id: string) => void;
}

export const Call = ({ conversationId, onConversationStart }: CallProps = {}) => {
  const remoteParticipantIds = useParticipantIds({ filter: 'remote' });
  const localSessionId = useLocalSessionId();
  const [mode, setMode] = useState<'full' | 'minimal'>('full');
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

  const handleToggleMode = () => {
    setMode(prev => prev === 'full' ? 'minimal' : 'full');
  }
  // Generate a conversation ID if one isn't provided
  useEffect(() => {
    if (!conversationId && onConversationStart) {
      const generatedId = `call-${Date.now()}`;
      onConversationStart(generatedId);
    }
  }, [conversationId, onConversationStart]);
  // Simulate conversation start when remote participant joins
  useEffect(() => {
    if (remoteParticipantIds.length > 0 && conversationId && onConversationStart) {
      onConversationStart(conversationId);
    }
  }, [remoteParticipantIds.length, conversationId, onConversationStart]);

  return <>
    <div className={cn("flex items-center justify-center w-full h-full", {
      'fixed bottom-20 right-20': mode === 'minimal',
    })}>
      <div className='relative w-full h-full'>
        <Button variant='outline' onClick={handleToggleMode} className='absolute top-2 right-2 z-10 gap-2' size='sm'>
          {mode === 'full' ? 'Minimize' : 'Maximize'}
          {mode === 'full' ? <Minimize className='size-4' /> : <Maximize className='size-4' />}
        </Button>
        
        {remoteParticipantIds.length > 0 ? (
          <Video
            id={remoteParticipantIds[0]}
            className={cn({
              // Mobile: 9:16 aspect ratio
              'w-full max-w-full aspect-[9/16]': isMobile && mode === 'full',
              // Desktop: 16:9 aspect ratio (aspect-video)
              'w-full aspect-video': !isMobile && mode === 'full',
              // Minimal mode
              'w-full max-w-xs aspect-[9/16]': mode === 'minimal',
            })}
          />
        ) : (
          <div className={cn('relative flex items-center justify-center w-full bg-slate-100 rounded-md', {
            // Mobile: 9:16 aspect ratio
            'max-w-full aspect-[9/16]': isMobile && mode === 'full',
            // Desktop: 16:9 aspect ratio
            'aspect-video': !isMobile && mode === 'full',
            // Minimal mode
            'max-w-xs aspect-[9/16]': mode === 'minimal',
          })}>
            <p className='text-2xl text-black'>Waiting for others to join...</p>
          </div>
        )}
        
        {localSessionId && (
          <Video
            id={localSessionId}
            className={cn('absolute z-10 border-2 border-white shadow-lg rounded-md overflow-hidden', {
              // Mobile: 9:16 aspect ratio for user camera
              'bottom-6 right-6 w-1/4 min-w-[120px] max-w-[180px] aspect-[9/16]': isMobile && mode === 'full',
              // Desktop: 16:9 aspect ratio for user camera
              'bottom-6 right-6 w-1/4 min-w-[120px] max-w-[180px] aspect-video': !isMobile && mode === 'full',
              // Minimal mode - also apply responsive aspect ratio
              'bottom-4 right-4 w-24 aspect-[9/16]': isMobile && mode === 'minimal',
              'bottom-4 right-4 w-24 aspect-video': !isMobile && mode === 'minimal',
            })}
          />
        )}
      </div>
    </div>
    <DailyAudio />
  </>
}