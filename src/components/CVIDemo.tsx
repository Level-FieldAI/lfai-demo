import React, { useRef } from 'react';
import TavusCVIPlayer from './TavusCVIPlayer';
import { getCviId } from '@/config/tavus';

const CVIDemo: React.FC = () => {
  const playerRef = useRef<{
    play: () => void;
    pause: () => void;
    player: any;
  }>(null);

  // Get CVI ID from configuration
  const CVI_ID = getCviId();

  const handleReady = () => {
    console.log('CVI Player is ready!');
  };

  const handleError = (error: any) => {
    console.error('CVI Player error:', error);
  };

  const handlePlay = () => {
    console.log('CVI Player started playing');
  };

  const handlePause = () => {
    console.log('CVI Player paused');
  };

  const playVideo = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  return (
    <div className="w-full h-screen relative">
      {/* Control Panel (Optional - for testing) */}
      <div className="absolute top-4 left-4 z-20 bg-black bg-opacity-50 p-4 rounded-lg">
        <h3 className="text-white text-lg font-semibold mb-2">CVI Controls</h3>
        <div className="flex gap-2">
          <button
            onClick={playVideo}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Play
          </button>
          <button
            onClick={pauseVideo}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Pause
          </button>
        </div>
      </div>

      {/* CVI Player */}
      <TavusCVIPlayer
        cviId={CVI_ID}
        className="w-full h-full"
        autoplay={true}
        loop={true}
        controls={false}
        mute={true}
        transparentBackground={true}
        onReady={handleReady}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </div>
  );
};

export default CVIDemo;