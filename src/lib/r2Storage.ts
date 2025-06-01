import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 Configuration
const R2_CONFIG = {
  accountId: '313333285e943bbbd67e79b824551b47',
  endpoint: 'https://313333285e943bbbd67e79b824551b47.r2.cloudflarestorage.com',
  region: 'auto', // R2 uses 'auto' as the region
  bucketName: 'lfai-video-demo', // You'll need to create this bucket
};

// Environment variables for R2 credentials
// You'll need to set these in your .env file after creating API tokens
const R2_ACCESS_KEY = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;

export interface R2UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

export interface R2VideoMetadata {
  key: string;
  url: string;
  size?: number;
  lastModified?: Date;
  contentType?: string;
  metadata?: Record<string, string>;
}

class R2StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    if (!R2_ACCESS_KEY || !R2_SECRET_KEY) {
      console.warn('R2 credentials not found. Some features may not work.');
    }

    this.bucketName = R2_CONFIG.bucketName;
    this.s3Client = new S3Client({
      region: R2_CONFIG.region,
      endpoint: R2_CONFIG.endpoint,
      credentials: {
        accessKeyId: R2_ACCESS_KEY || '',
        secretAccessKey: R2_SECRET_KEY || '',
      },
      forcePathStyle: true, // Required for R2
    });
  }

  /**
   * Upload a video file to R2
   */
  async uploadVideo(
    file: File | Blob,
    key: string,
    options: R2UploadOptions = {}
  ): Promise<R2VideoMetadata> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: options.contentType || 'video/mp4',
        Metadata: options.metadata,
        CacheControl: options.cacheControl || 'public, max-age=31536000', // 1 year cache
      });

      await this.s3Client.send(command);

      return {
        key,
        url: this.getPublicUrl(key),
        size: file.size,
        contentType: options.contentType || 'video/mp4',
        metadata: options.metadata,
      };
    } catch (error) {
      console.error('Error uploading video to R2:', error);
      throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get video metadata from R2
   */
  async getVideoMetadata(key: string): Promise<R2VideoMetadata | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      return {
        key,
        url: this.getPublicUrl(key),
        size: response.ContentLength,
        lastModified: response.LastModified,
        contentType: response.ContentType,
        metadata: response.Metadata,
      };
    } catch (error) {
      console.error('Error getting video metadata from R2:', error);
      return null;
    }
  }

  /**
   * Generate a signed URL for private video access
   */
  async getSignedVideoUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get public URL for a video (if bucket allows public access)
   */
  getPublicUrl(key: string): string {
    return `${R2_CONFIG.endpoint}/${this.bucketName}/${key}`;
  }

  /**
   * Generate optimized video URL with query parameters
   */
  getOptimizedUrl(key: string, options?: {
    quality?: 'auto' | 'high' | 'medium' | 'low';
    format?: 'mp4' | 'webm';
    width?: number;
    height?: number;
  }): string {
    const baseUrl = this.getPublicUrl(key);
    
    if (!options) return baseUrl;

    const url = new URL(baseUrl);
    
    if (options.quality && options.quality !== 'auto') {
      url.searchParams.set('quality', options.quality);
    }
    
    if (options.format) {
      url.searchParams.set('format', options.format);
    }
    
    if (options.width) {
      url.searchParams.set('width', options.width.toString());
    }
    
    if (options.height) {
      url.searchParams.set('height', options.height.toString());
    }

    return url.toString();
  }

  /**
   * Check if R2 service is properly configured
   */
  isConfigured(): boolean {
    return !!(R2_ACCESS_KEY && R2_SECRET_KEY);
  }

  /**
   * Test R2 connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to list objects in the bucket (this will fail gracefully if no access)
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: 'test-connection', // This key doesn't need to exist
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      // If the error is 404 (not found), the connection is working
      if (error instanceof Error && error.name === 'NotFound') {
        return true;
      }
      console.error('R2 connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const r2Storage = new R2StorageService();
export default r2Storage;