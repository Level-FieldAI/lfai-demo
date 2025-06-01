import { useState, useEffect, useCallback } from 'react';
import { videoService, VideoMetadata, VideoLoadResult } from '@/lib/videoService';

interface VideoState {
  isLoading: boolean;
  hasError: boolean;
  loadResult: VideoLoadResult | null;
  retryCount: number;
}

interface UseVideoManagerOptions {
  preloadVideos?: boolean;
  maxRetries?: number;
  onVideoStateChange?: (videoUrl: string, state: VideoState) => void;
}

export const useVideoManager = (
  videos: VideoMetadata[],
  options: UseVideoManagerOptions = {}
) => {
  const {
    preloadVideos = true,
    maxRetries = 3,
    onVideoStateChange
  } = options;

  const [videoStates, setVideoStates] = useState<Map<string, VideoState>>(new Map());
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  // Initialize video states
  useEffect(() => {
    const initialStates = new Map<string, VideoState>();
    videos.forEach(video => {
      initialStates.set(video.url, {
        isLoading: true,
        hasError: false,
        loadResult: null,
        retryCount: 0
      });
    });
    setVideoStates(initialStates);
  }, [videos]);

  // Preload videos if enabled
  useEffect(() => {
    if (preloadVideos && videos.length > 0) {
      preloadAllVideos();
    }
  }, [videos, preloadVideos]);

  const updateVideoState = useCallback((videoUrl: string, updates: Partial<VideoState>) => {
    setVideoStates(prev => {
      const newStates = new Map(prev);
      const currentState = newStates.get(videoUrl) || {
        isLoading: false,
        hasError: false,
        loadResult: null,
        retryCount: 0
      };
      
      const newState = { ...currentState, ...updates };
      newStates.set(videoUrl, newState);
      
      // Notify callback if provided
      onVideoStateChange?.(videoUrl, newState);
      
      return newStates;
    });
  }, [onVideoStateChange]);

  const preloadAllVideos = async () => {
    setIsPreloading(true);
    setPreloadProgress(0);

    try {
      let completed = 0;
      const total = videos.length;

      // Process videos in parallel but track progress
      const promises = videos.map(async (video) => {
        updateVideoState(video.url, { isLoading: true, hasError: false });
        
        try {
          const result = await videoService.loadVideo(video);
          
          updateVideoState(video.url, {
            isLoading: false,
            hasError: !result.success,
            loadResult: result,
            retryCount: 0
          });
          
          completed++;
          setPreloadProgress((completed / total) * 100);
          
          return { video, result };
        } catch (error) {
          updateVideoState(video.url, {
            isLoading: false,
            hasError: true,
            loadResult: {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            },
            retryCount: 0
          });
          
          completed++;
          setPreloadProgress((completed / total) * 100);
          
          return { video, result: null };
        }
      });

      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error preloading videos:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  const retryVideo = async (videoUrl: string) => {
    const video = videos.find(v => v.url === videoUrl);
    if (!video) return;

    const currentState = videoStates.get(videoUrl);
    const retryCount = (currentState?.retryCount || 0) + 1;

    if (retryCount > maxRetries) {
      updateVideoState(videoUrl, {
        hasError: true,
        loadResult: {
          success: false,
          error: 'Maximum retry attempts exceeded'
        }
      });
      return;
    }

    updateVideoState(videoUrl, {
      isLoading: true,
      hasError: false,
      retryCount
    });

    try {
      // Clear cache for this video before retrying
      videoService.clearCache(videoUrl);
      
      const result = await videoService.loadVideo(video);
      
      updateVideoState(videoUrl, {
        isLoading: false,
        hasError: !result.success,
        loadResult: result,
        retryCount: result.success ? 0 : retryCount
      });
    } catch (error) {
      updateVideoState(videoUrl, {
        isLoading: false,
        hasError: true,
        loadResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Retry failed'
        },
        retryCount
      });
    }
  };

  const retryAllFailedVideos = async () => {
    const failedVideos = Array.from(videoStates.entries())
      .filter(([_, state]) => state.hasError)
      .map(([url]) => url);

    for (const videoUrl of failedVideos) {
      await retryVideo(videoUrl);
    }
  };

  const clearAllCaches = () => {
    videoService.clearCache();
    // Reset all video states
    videos.forEach(video => {
      updateVideoState(video.url, {
        isLoading: true,
        hasError: false,
        loadResult: null,
        retryCount: 0
      });
    });
  };

  const getVideoState = (videoUrl: string): VideoState => {
    return videoStates.get(videoUrl) || {
      isLoading: false,
      hasError: false,
      loadResult: null,
      retryCount: 0
    };
  };

  const getOverallStats = () => {
    const states = Array.from(videoStates.values());
    const total = states.length;
    const loading = states.filter(s => s.isLoading).length;
    const errors = states.filter(s => s.hasError).length;
    const successful = states.filter(s => s.loadResult?.success).length;

    return {
      total,
      loading,
      errors,
      successful,
      loadingPercentage: total > 0 ? (loading / total) * 100 : 0,
      errorPercentage: total > 0 ? (errors / total) * 100 : 0,
      successPercentage: total > 0 ? (successful / total) * 100 : 0
    };
  };

  return {
    videoStates,
    isPreloading,
    preloadProgress,
    getVideoState,
    retryVideo,
    retryAllFailedVideos,
    clearAllCaches,
    preloadAllVideos,
    getOverallStats,
    updateVideoState
  };
};