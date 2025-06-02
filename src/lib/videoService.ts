// This file has been removed as part of video system cleanup
// Video service functionality is no longer needed
      
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