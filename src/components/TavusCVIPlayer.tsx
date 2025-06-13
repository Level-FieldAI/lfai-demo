import React, { useEffect, useRef, useState } from 'react';
import { TAVUS_CONFIG, validateCviId } from '@/config/tavus';

interface TavusCVIPlayerProps {
  cviId: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  mute?: boolean;
  transparentBackground?: boolean;
  onReady?: () => void;
  onError?: (error: any) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

declare global {
  interface Window {
    Tavus: any;
    cviPlayer: any;
  }
}

const TavusCVIPlayer: React.FC<TavusCVIPlayerProps> = ({
  cviId,
  className = '',
  autoplay = true,
  loop = true,
  controls = false,
  mute = true,
  transparentBackground = true,
  onReady,
  onError,
  onPlay,
  onPause
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);

  /**
   * Load the Tavus SDK dynamically
   */
  const loadTavusSDK = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (window.Tavus) {
        return resolve(window.Tavus);
      }

      const script = document.createElement('script');
      script.src = TAVUS_CONFIG.SDK_URL;
      script.async = true;
      
      script.onload = () => {
        if (window.Tavus) {
          resolve(window.Tavus);
        } else {
          reject(new Error('Tavus SDK loaded but not available'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Tavus SDK'));
      };
      
      document.head.appendChild(script);
    });
  };

  /**
   * Initialize the CVI player
   */
  const initializePlayer = async () => {
    if (!containerRef.current || !cviId || !validateCviId(cviId)) {
      setError(TAVUS_CONFIG.ERRORS.INVALID_CVI_ID);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Load Tavus SDK
      const Tavus = await loadTavusSDK();

      // Create player configuration
      const playerConfig = {
        container: containerRef.current,
        cviId: cviId,
        transparentBackground,
        autoplay,
        loop,
        controls,
        mute,
        width: '100%',
        height: '100%'
      };

      // Initialize player
      const newPlayer = new Tavus.Player(playerConfig);

      // Set up event listeners
      newPlayer.on('ready', () => {
        console.log('CVI player is ready');
        setIsLoading(false);
        onReady?.();
      });

      newPlayer.on('error', (err: any) => {
        console.error('CVI player error:', err);
        setError(TAVUS_CONFIG.ERRORS.PLAYER_ERROR);
        setIsLoading(false);
        onError?.(err);
      });

      newPlayer.on('play', () => {
        console.log('CVI player started playing');
        onPlay?.();
      });

      newPlayer.on('pause', () => {
        console.log('CVI player paused');
        onPause?.();
      });

      setPlayer(newPlayer);
      window.cviPlayer = newPlayer; // For debugging

    } catch (err: any) {
      console.error('Failed to initialize CVI Player:', err);
      setError(err.message || TAVUS_CONFIG.ERRORS.PLAYER_INIT_FAILED);
      setIsLoading(false);
    }
  };

  /**
   * Cleanup player on unmount
   */
  const cleanupPlayer = () => {
    if (player && typeof player.destroy === 'function') {
      player.destroy();
    }
    setPlayer(null);
  };

  // Initialize player on mount
  useEffect(() => {
    initializePlayer();
    
    return cleanupPlayer;
  }, [cviId]);

  // Public methods for external control
  const playVideo = () => {
    if (player && typeof player.play === 'function') {
      player.play();
    }
  };

  const pauseVideo = () => {
    if (player && typeof player.pause === 'function') {
      player.pause();
    }
  };

  // Create a separate ref for imperative handle
  const playerRef = useRef<{
    play: () => void;
    pause: () => void;
    player: any;
  }>(null);

  // Expose methods via ref (optional)
  React.useImperativeHandle(playerRef, () => ({
    play: playVideo,
    pause: pauseVideo,
    player: player
  }));

  return (
    <div className={`cvi-container ${className}`}>
      {/* Background content (optional) */}
      <div className="content-behind">
        <h1>Level-FieldAI Avatar</h1>
      </div>

      {/* CVI Player Container */}
      <div 
        ref={containerRef}
        id="cvi-player-container"
        className="w-full h-full flex items-center justify-center"
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div 
            id="custom-loading-indicator" 
            className="loading-indicator"
          >
            {error ? error : 'Loading CVI...'}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="loading-indicator cvi-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TavusCVIPlayer;