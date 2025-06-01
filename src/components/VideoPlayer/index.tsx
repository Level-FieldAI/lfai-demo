import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Download, AlertCircle } from 'lucide-react';
import { videoService, VideoMetadata, VideoLoadResult } from '@/lib/videoService';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  video: VideoMetadata;
  index: number;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  onLoadStateChange?: (isLoading: boolean, hasError: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  index,
  className,
  autoPlay = false,
  showControls = true,
  onLoadStateChange
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadResult, setLoadResult] = useState<VideoLoadResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showRetryButton, setShowRetryButton] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadStateChange?.(isLoading, hasError);
  }, [isLoading, hasError, onLoadStateChange]);

  // Load video on mount and when video changes
  useEffect(() => {
    loadVideo();
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [video.url]);

  const loadVideo = async () => {
    setIsLoading(true);
    setHasError(false);
    setShowRetryButton(false);

    try {
      const result = await videoService.loadVideo(video);
      setLoadResult(result);

      if (result.success && result.url) {
        // Video is available, let the video element handle loading
        setIsLoading(false);
      } else {
        // Video is not available
        setHasError(true);
        setIsLoading(false);
        
        // Schedule retry if retryAfter is specified
        if (result.retryAfter && retryCount < 3) {
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            loadVideo();
          }, result.retryAfter * 1000);
        } else {
          setShowRetryButton(true);
        }
      }
    } catch (error) {
      console.error('Error loading video:', error);
      setHasError(true);
      setIsLoading(false);
      setShowRetryButton(true);
    }
  };

  const handleVideoLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleVideoCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Video error for ${video.title}:`, e);
    setIsLoading(false);
    setHasError(true);
    setShowRetryButton(true);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleRetry = () => {
    setRetryCount(0);
    videoService.clearCache(video.url);
    loadVideo();
  };

  const handleDownload = async () => {
    if (!loadResult?.url) {
      console.error('No video URL available for download');      alert('Download failed: No video URL available. Please try refreshing the page.');      return;
    }

    try {
      const result = await videoService.downloadVideo(video, loadResult.url);
      
      if (!result.success) {
        console.error('Download failed:', result.error);
        alert(`Download failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed: An unexpected error occurred. Please try again.');
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className={cn(
      "flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-royalBlue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
      className
    )}>
      {/* Video Container */}
      <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-royalBlue-100 to-gold-100">
        {hasError ? (
          // Error State
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
            <div className="text-center p-4 max-w-sm">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <p className="font-medium mb-2 text-gray-800">Video Temporarily Unavailable</p>
              <p className="text-sm text-gray-600 mb-3">
                {loadResult?.error || 'This demo video is currently being updated'}
              </p>
              
              {showRetryButton && (
                <div className="space-y-2">
                  <button 
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-royalBlue-600 text-white rounded-lg hover:bg-royalBlue-700 transition-colors text-sm mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                  
                  {retryCount > 0 && (
                    <p className="text-xs text-gray-500">
                      Retry attempt: {retryCount}/3
                    </p>
                  )}
                </div>
              )}
              
              {!showRetryButton && loadResult?.retryAfter && (
                <p className="text-xs text-gray-500">
                  Retrying automatically in {loadResult.retryAfter}s...
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Video Element */}
            <video
              ref={videoRef}
              data-video-index={index}
              controls={showControls}
              preload="metadata"
              autoPlay={autoPlay}
              className="w-full h-full object-cover"
              poster={video.thumbnailUrl || `https://placehold.co/400x225/4588FF/ffffff?text=${encodeURIComponent(video.title)}`}
              onLoadStart={handleVideoLoadStart}
              onCanPlay={handleVideoCanPlay}
              onError={handleVideoError}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              crossOrigin="anonymous"
            >
              {loadResult?.url && (
                <source src={loadResult.url} type="video/mp4" />
              )}
              
              {/* Fallback content */}
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-royalBlue-100 to-gold-100 text-royalBlue-700">
                <div className="text-center p-4">
                  <p className="font-medium mb-2">Your browser does not support video playback.</p>
                  {loadResult?.url && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 text-royalBlue-600 hover:text-royalBlue-800 underline mx-auto"
                    >
                      <Download className="w-4 h-4" />
                      Download video instead
                    </button>
                  )}
                </div>
              </div>
            </video>
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-royalBlue-100/90 to-gold-100/90 backdrop-blur-sm">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royalBlue-600 mb-3 mx-auto"></div>
                  <p className="text-royalBlue-700 font-medium">Loading video...</p>
                  {retryCount > 0 && (
                    <p className="text-sm text-royalBlue-600 mt-1">
                      Attempt {retryCount + 1}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Play Button Overlay */}
            {!isLoading && !isPlaying && showControls && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-opacity duration-300">
                  <Play className="w-8 h-8 text-royalBlue-600 ml-1" fill="currentColor" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Info */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-royalBlue-800 leading-tight">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {video.description}
        </p>
        
        {/* Video Metadata */}
        {(video.duration || video.size) && (
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
            {video.duration && (
              <span>Duration: {Math.round(video.duration)}s</span>
            )}
            {video.size && (
              <span>Size: {formatFileSize(video.size)}</span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {loadResult?.url && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                title="Download video"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            )}
          </div>
                      
            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => {
                  console.log('Video Debug Info:', {
                    video,
                    loadResult,
                    hasError,
                    isLoading,
                    retryCount
                  });
                  alert(`Debug Info logged to console. URL: ${loadResult?.url || 'No URL'}`);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                title="Debug video info"
              >
                🐛
              </button>
            )}          {hasError && showRetryButton && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-royalBlue-100 hover:bg-royalBlue-200 text-royalBlue-700 rounded-md transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};