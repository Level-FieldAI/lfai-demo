import { r2Storage } from '@/lib/r2Storage';
import { VIDEO_LIST } from '@/constants/videos';

export interface MigrationProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string;
  errors: Array<{ url: string; error: string }>;
}

export interface MigrationResult {
  success: boolean;
  migratedVideos: Array<{ originalUrl: string; newUrl: string; key: string }>;
  errors: Array<{ url: string; error: string }>;
}

/**
 * Download a video from a URL and return as Blob
 */
async function downloadVideo(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
  }
  return await response.blob();
}

/**
 * Generate a clean key for R2 storage
 */
function generateVideoKey(originalUrl: string, title: string): string {
  // Extract filename from URL or use title
  const urlParts = originalUrl.split('/');
  const filename = urlParts[urlParts.length - 1] || title;
  
  // Clean the filename
  const cleanFilename = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
  
  // Ensure it has .mp4 extension
  const finalFilename = cleanFilename.endsWith('.mp4') 
    ? cleanFilename 
    : `${cleanFilename}.mp4`;
  
  return `videos/${finalFilename}`;
}

/**
 * Migrate a single video to R2
 */
export async function migrateVideo(
  originalUrl: string, 
  title: string,
  onProgress?: (progress: { stage: string; percent: number }) => void
): Promise<{ success: boolean; newUrl?: string; key?: string; error?: string }> {
  try {
    onProgress?.({ stage: 'Downloading video...', percent: 0 });
    
    // Download the video
    const videoBlob = await downloadVideo(originalUrl);
    
    onProgress?.({ stage: 'Uploading to R2...', percent: 50 });
    
    // Generate key for R2
    const key = generateVideoKey(originalUrl, title);
    
    // Upload to R2
    const metadata = await r2Storage.uploadVideo(videoBlob, key, {
      contentType: 'video/mp4',
      metadata: {
        originalUrl,
        title,
        migratedAt: new Date().toISOString(),
        size: videoBlob.size.toString()
      }
    });
    
    onProgress?.({ stage: 'Complete!', percent: 100 });
    
    return {
      success: true,
      newUrl: metadata.url,
      key: metadata.key
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Migrate all videos from VIDEO_LIST to R2
 */
export async function migrateAllVideos(
  onProgress?: (progress: MigrationProgress) => void
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migratedVideos: [],
    errors: []
  };
  
  const total = VIDEO_LIST.length;
  let completed = 0;
  let failed = 0;
  
  for (const video of VIDEO_LIST) {
    onProgress?.({
      total,
      completed,
      failed,
      current: video.title,
      errors: result.errors
    });
    
    try {
      const migrationResult = await migrateVideo(
        video.url,
        video.title,
        (videoProgress) => {
          onProgress?.({
            total,
            completed,
            failed,
            current: `${video.title} - ${videoProgress.stage}`,
            errors: result.errors
          });
        }
      );
      
      if (migrationResult.success && migrationResult.newUrl && migrationResult.key) {
        result.migratedVideos.push({
          originalUrl: video.url,
          newUrl: migrationResult.newUrl,
          key: migrationResult.key
        });
        completed++;
      } else {
        result.errors.push({
          url: video.url,
          error: migrationResult.error || 'Unknown error'
        });
        failed++;
        result.success = false;
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push({
        url: video.url,
        error: errorMessage
      });
      failed++;
      result.success = false;
    }
  }
  
  onProgress?.({
    total,
    completed,
    failed,
    errors: result.errors
  });
  
  return result;
}

/**
 * Generate updated video configuration code
 */
export function generateUpdatedVideoConfig(migratedVideos: Array<{ originalUrl: string; newUrl: string; key: string }>): string {
  const videoListCode = VIDEO_LIST.map(video => {
    const migrated = migratedVideos.find(m => m.originalUrl === video.url);
    const url = migrated ? migrated.newUrl : video.url;
    
    return `  {
    title: '${video.title}',
    url: '${url}',
    fallbackUrl: '${video.fallbackUrl || ''}',
    thumbnailUrl: '${video.thumbnailUrl || ''}',
    description: '${video.description}',
    duration: ${video.duration || 0},
    size: ${video.size || 0}
  }`;
  }).join(',\n');
  
  return `// Updated video configuration with R2 URLs
export const VIDEO_LIST: VideoMetadata[] = [
${videoListCode}
];`;
}

/**
 * Test R2 connection and configuration
 */
export async function testR2Connection(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!r2Storage.isConfigured()) {
      return {
        success: false,
        error: 'R2 storage is not configured. Please check your environment variables.'
      };
    }
    
    const isConnected = await r2Storage.testConnection();
    
    if (!isConnected) {
      return {
        success: false,
        error: 'Failed to connect to R2. Please check your credentials and bucket configuration.'
      };
    }
    
    return { success: true };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}