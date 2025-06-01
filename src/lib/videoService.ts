export interface VideoMetadata {
  title: string;
  url: string;
  description: string;
  fallbackUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  size?: number;
}

export interface VideoLoadResult {
  success: boolean;
  url?: string;
  error?: string;
  retryAfter?: number; // seconds to wait before retry
}

export class VideoService {
  private static instance: VideoService;
  private cache = new Map<string, VideoLoadResult>();
  private retryAttempts = new Map<string, number>();
  private readonly maxRetries = 3;
  private readonly retryDelay = 2000; // 2 seconds

  static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  /**
   * Check if a video URL is accessible
   */
  async checkVideoAvailability(url: string): Promise<VideoLoadResult> {
    const cacheKey = `availability_${url}`;
    
    // Check cache first (cache for 5 minutes)
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - (cached as any).timestamp < 5 * 60 * 1000) {
      return cached;
    }

    try {
      // Use HEAD request to check if video exists without downloading
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'cors',
        cache: 'no-cache'
      });

      const result: VideoLoadResult = {
        success: response.ok,
        url: response.ok ? url : undefined,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };

      // Cache the result
      (result as any).timestamp = Date.now();
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      const result: VideoLoadResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        retryAfter: this.calculateRetryDelay(url)
      };

      (result as any).timestamp = Date.now();
      this.cache.set(cacheKey, result);

      return result;
    }
  }

  /**
   * Load video with retry logic and fallbacks
   */
  async loadVideo(video: VideoMetadata): Promise<VideoLoadResult> {
    const primaryResult = await this.checkVideoAvailability(video.url);
    
    if (primaryResult.success) {
      this.retryAttempts.delete(video.url);
      return primaryResult;
    }

    // Try fallback URL if available
    if (video.fallbackUrl) {
      const fallbackResult = await this.checkVideoAvailability(video.fallbackUrl);
      if (fallbackResult.success) {
        return {
          ...fallbackResult,
          url: video.fallbackUrl
        };
      }
    }

    // Implement retry logic
    const attempts = this.retryAttempts.get(video.url) || 0;
    if (attempts < this.maxRetries) {
      this.retryAttempts.set(video.url, attempts + 1);
      
      return {
        success: false,
        error: `Video temporarily unavailable (attempt ${attempts + 1}/${this.maxRetries})`,
        retryAfter: this.calculateRetryDelay(video.url)
      };
    }

    // Max retries exceeded
    return {
      success: false,
      error: 'Video is currently unavailable. Please try again later.',
      retryAfter: 300 // 5 minutes
    };
  }

  /**
   * Preload videos for better user experience
   */
  async preloadVideos(videos: VideoMetadata[]): Promise<Map<string, VideoLoadResult>> {
    const results = new Map<string, VideoLoadResult>();
    
    const promises = videos.map(async (video) => {
      const result = await this.loadVideo(video);
      results.set(video.url, result);
      return { video, result };
    });

    await Promise.allSettled(promises);
    return results;
  }

  /**
   * Generate optimized video URLs for Cloudflare R2
   */
  generateOptimizedUrl(baseUrl: string, options?: {
    quality?: 'auto' | 'high' | 'medium' | 'low';
    format?: 'mp4' | 'webm';
    width?: number;
    height?: number;
  }): string {
    const url = new URL(baseUrl);
    
    if (options?.quality && options.quality !== 'auto') {
      url.searchParams.set('quality', options.quality);
    }
    
    if (options?.format) {
      url.searchParams.set('format', options.format);
    }
    
    if (options?.width) {
      url.searchParams.set('width', options.width.toString());
    }
    
    if (options?.height) {
      url.searchParams.set('height', options.height.toString());
    }

    return url.toString();
  }

  /**
   * Clear cache for a specific video or all videos
   */
  clearCache(url?: string): void {
    if (url) {
      this.cache.delete(`availability_${url}`);
      this.retryAttempts.delete(url);
    } else {
      this.cache.clear();
      this.retryAttempts.clear();
    }
  }

  /**
   * Get video metadata including file size and duration (if possible)
   */
  async getVideoMetadata(url: string): Promise<Partial<VideoMetadata>> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      
      const metadata: Partial<VideoMetadata> = {
        url
      };

      // Get file size from Content-Length header
      const contentLength = response.headers.get('Content-Length');
      if (contentLength) {
        metadata.size = parseInt(contentLength, 10);
      }

      // Get last modified date
      const lastModified = response.headers.get('Last-Modified');
      if (lastModified) {
        (metadata as any).lastModified = new Date(lastModified);
      }

      return metadata;
    } catch (error) {
      console.warn('Failed to get video metadata:', error);
      return { url };
    }
  }

  private calculateRetryDelay(url: string): number {
    const attempts = this.retryAttempts.get(url) || 0;
    // Exponential backoff: 2s, 4s, 8s
    return Math.min(this.retryDelay * Math.pow(2, attempts), 30000); // Max 30 seconds
  }
}

// Export singleton instance
export const videoService = VideoService.getInstance();