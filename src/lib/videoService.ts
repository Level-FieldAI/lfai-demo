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
   * Validate and normalize video URL
   */
  validateVideoUrl(url: string): { isValid: boolean; normalizedUrl?: string; error?: string } {
    try {
      const urlObj = new URL(url);
      
      // Check if it's a valid HTTP/HTTPS URL
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          isValid: false,
          error: 'URL must use HTTP or HTTPS protocol'
        };
      }
      
      // Check if it looks like a video file
      const pathname = urlObj.pathname.toLowerCase();
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
      const hasVideoExtension = videoExtensions.some(ext => pathname.endsWith(ext));
      
      if (!hasVideoExtension) {
        console.warn('URL does not appear to be a video file:', url);
      }
      
      // Normalize URL (remove unnecessary query params, etc.)
      const normalizedUrl = urlObj.toString();
      
      return {
        isValid: true,
        normalizedUrl
      };
      
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid URL format'
      };
    }
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
        cache: 'no-cache',
        headers: {
          'Accept': 'video/*,*/*;q=0.9'
        }
      });

      let errorMessage: string | undefined;
      if (!response.ok) {
        switch (response.status) {
          case 404:
            errorMessage = 'Video file not found (404). The video may have been moved or deleted.';
            break;
          case 403:
            errorMessage = 'Access denied (403). The video may be private or require authentication.';
            break;
          case 500:
            errorMessage = 'Server error (500). The video hosting service is experiencing issues.';
            break;
          case 503:
            errorMessage = 'Service unavailable (503). The video hosting service is temporarily down.';
            break;
          default:
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
      }

      const result: VideoLoadResult = {
        success: response.ok,
        url: response.ok ? url : undefined,
        error: errorMessage
      };

      // Cache the result (shorter cache for errors)
      (result as any).timestamp = Date.now();
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      let errorMessage = 'Network error';
      
      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network connection failed. This could be due to CORS restrictions, network issues, or the server being unreachable.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS error: The video server does not allow cross-origin requests from this domain.';
        } else {
          errorMessage = `Network error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      const result: VideoLoadResult = {
        success: false,
        error: errorMessage,
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
    // Validate primary URL
    const urlValidation = this.validateVideoUrl(video.url);
    if (!urlValidation.isValid) {
      return {
        success: false,
        error: `Invalid video URL: ${urlValidation.error}`
      };
    }
    
    const primaryResult = await this.checkVideoAvailability(urlValidation.normalizedUrl || video.url);
    
    if (primaryResult.success) {
      this.retryAttempts.delete(video.url);
      return primaryResult;
    }

    // Try fallback URL if available
    if (video.fallbackUrl) {
      const fallbackValidation = this.validateVideoUrl(video.fallbackUrl);
      if (fallbackValidation.isValid) {
        const fallbackResult = await this.checkVideoAvailability(fallbackValidation.normalizedUrl || video.fallbackUrl);
        if (fallbackResult.success) {
          return {
            ...fallbackResult,
            url: fallbackValidation.normalizedUrl || video.fallbackUrl
          };
        }
      }
    }

    // Implement retry logic
    const attempts = this.retryAttempts.get(video.url) || 0;
    if (attempts < this.maxRetries) {
      this.retryAttempts.set(video.url, attempts + 1);
      
      return {
        success: false,
        error: `Video temporarily unavailable (attempt ${attempts + 1}/${this.maxRetries}). ${primaryResult.error || ''}`,
        retryAfter: this.calculateRetryDelay(video.url)
      };
    }

    // Max retries exceeded
    return {
      success: false,
      error: `Video is currently unavailable after ${this.maxRetries} attempts. ${primaryResult.error || 'Please try again later.'}`,
      retryAfter: 300 // 5 minutes
    };
  }

  /**
   * Download video with proper error handling
   */
  async downloadVideo(video: VideoMetadata, url: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First verify the URL is accessible
      const availability = await this.checkVideoAvailability(url);
      
      if (!availability.success) {
        return {
          success: false,
          error: availability.error || 'Video is not accessible for download'
        };
      }

      // Try multiple download approaches
      return await this.attemptDownload(video, url);
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed due to unknown error'
      };
    }
  }

  /**
   * Attempt download with multiple fallback methods
   */
  private async attemptDownload(video: VideoMetadata, url: string): Promise<{ success: boolean; error?: string }> {
    // Method 1: Standard download link
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${video.title}.mp4`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
      
    } catch (error) {
      console.warn('Standard download failed, trying alternative method:', error);
    }

    // Method 2: Open in new window (fallback)
    try {
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Download blocked by popup blocker. Please allow popups and try again.'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'All download methods failed. Please try right-clicking the video and selecting "Save video as..."'
      };
    }
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
   * Test all video URLs and return detailed status
   */
  async testAllVideoUrls(videos: VideoMetadata[]): Promise<Array<{
    video: VideoMetadata;
    primaryStatus: VideoLoadResult;
    fallbackStatus?: VideoLoadResult;
  }>> {
    const results = [];
    
    for (const video of videos) {
      const primaryStatus = await this.checkVideoAvailability(video.url);
      let fallbackStatus: VideoLoadResult | undefined;
      
      if (video.fallbackUrl) {
        fallbackStatus = await this.checkVideoAvailability(video.fallbackUrl);
      }
      
      results.push({
        video,
        primaryStatus,
        fallbackStatus
      });
    }
    
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
    // For R2 URLs, we can add query parameters for optimization
    // Note: These parameters would need to be handled by your R2 setup or a transform service
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
   * Check if URL is a Cloudflare R2 URL
   */
  isR2Url(url: string): boolean {
    return url.includes('.r2.cloudflarestorage.com');
  }

  /**
   * Generate R2 CDN URL for better performance
   */
  getR2CdnUrl(r2Url: string, customDomain?: string): string {
    if (customDomain) {
      // If you have a custom domain configured for R2
      const path = r2Url.split('/').slice(4).join('/'); // Remove protocol and domain
      return `https://${customDomain}/${path}`;
    }
    
    // Return original R2 URL
    return r2Url;
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