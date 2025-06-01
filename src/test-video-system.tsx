import React from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { useVideoManager } from './hooks/useVideoManager';
import { VIDEO_LIST } from './constants/videos';

// Simple test component to verify the video system
export const TestVideoSystem: React.FC = () => {
  const {
    isPreloading,
    preloadProgress,
    getVideoState,
    getOverallStats
  } = useVideoManager(VIDEO_LIST, {
    preloadVideos: true,
    maxRetries: 2,
    onVideoStateChange: (url, state) => {
      console.log(`Test: Video ${url} changed to:`, state);
    }
  });

  const stats = getOverallStats();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Video System Test</h1>
      
      {/* Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">System Status</h2>
        <p>Preloading: {isPreloading ? 'Yes' : 'No'}</p>
        <p>Progress: {Math.round(preloadProgress)}%</p>
        <p>Stats: {stats.successful}/{stats.total} loaded, {stats.errors} failed</p>
      </div>

      {/* Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VIDEO_LIST.map((video, index) => {
          const videoState = getVideoState(video.url);
          return (
            <div key={video.title} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Status: {videoState.isLoading ? 'Loading' : videoState.hasError ? 'Error' : videoState.loadResult?.success ? 'Loaded' : 'Unknown'}
              </p>
              <VideoPlayer
                video={video}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};