import { VideoMetadata } from '@/lib/videoService';

// Cloudflare R2 video hosting configuration
const VIDEO_CONFIG = {
  // Primary CDN (Cloudflare R2)
  primaryBaseUrl: 'https://313333285e943bbbd67e79b824551b47.r2.cloudflarestorage.com/lfai-video-demo',
  
  // Fallback CDN (backup R2 bucket or other CDN)
  fallbackBaseUrl: 'https://backup-cdn.example.com/videos', // Replace with actual backup CDN
  
  // Thumbnail base URL (can be same R2 bucket with different folder)
  thumbnailBaseUrl: 'https://313333285e943bbbd67e79b824551b47.r2.cloudflarestorage.com/lfai-video-demo/thumbnails',
  
  // R2 bucket configuration
  r2: {
    accountId: '313333285e943bbbd67e79b824551b47',
    bucketName: 'lfai-video-demo',
    endpoint: 'https://313333285e943bbbd67e79b824551b47.r2.cloudflarestorage.com'
  }
};

// Enhanced video list with metadata and fallbacks
export const VIDEO_LIST: VideoMetadata[] = [
  {
    title: 'Bruin Recruiting Video',
    url: `${VIDEO_CONFIG.primaryBaseUrl}/Bruin_Video.mp4`,
    fallbackUrl: `${VIDEO_CONFIG.fallbackBaseUrl}/Bruin_Video.mp4`,
    thumbnailUrl: `${VIDEO_CONFIG.thumbnailBaseUrl}/bruin_thumb.jpg`,
    description: 'AI avatar demonstration for recruiting and HR applications. See how our technology can transform your hiring process with personalized, interactive experiences.',
    duration: 120, // seconds - update with actual duration
    size: 15728640 // bytes - update with actual file size
  },
  {
    title: 'Cerebro Sports Video',
    url: `${VIDEO_CONFIG.primaryBaseUrl}/Cerebro%20Demo.mp4`,
    fallbackUrl: `${VIDEO_CONFIG.fallbackBaseUrl}/Cerebro_Demo.mp4`,
    thumbnailUrl: `${VIDEO_CONFIG.thumbnailBaseUrl}/cerebro_thumb.jpg`,
    description: 'Sports analytics and coaching with AI avatars. Experience how AI can enhance athletic performance analysis and provide personalized coaching insights.',
    duration: 90,
    size: 12582912
  },
  {
    title: 'Gregory CPA Video',
    url: `${VIDEO_CONFIG.primaryBaseUrl}/gregory_cpa.mp4`,
    fallbackUrl: `${VIDEO_CONFIG.fallbackBaseUrl}/gregory_cpa.mp4`,
    thumbnailUrl: `${VIDEO_CONFIG.thumbnailBaseUrl}/gregory_thumb.jpg`,
    description: 'Professional services and consultation AI avatar demo. Discover how AI avatars can provide expert financial advice and professional consultation services.',
    duration: 105,
    size: 14155776
  }
];

// Video categories for better organization
export const VIDEO_CATEGORIES = {
  'Business & Professional': [VIDEO_LIST[0], VIDEO_LIST[2]] as VideoMetadata[], // Bruin, Gregory
  'Sports & Analytics': [VIDEO_LIST[1]] as VideoMetadata[], // Cerebro
};

// Utility functions for video management
export const getVideoByTitle = (title: string): VideoMetadata | undefined => {
  return VIDEO_LIST.find(video => video.title === title);
};

export const getVideosByCategory = (category: keyof typeof VIDEO_CATEGORIES): VideoMetadata[] => {
  return VIDEO_CATEGORIES[category] || [];
};

// Video quality presets for different use cases
export const VIDEO_QUALITY_PRESETS = {
  thumbnail: { width: 320, height: 180, quality: 'low' as const },
  preview: { width: 640, height: 360, quality: 'medium' as const },
  full: { width: 1280, height: 720, quality: 'high' as const },
  hd: { width: 1920, height: 1080, quality: 'high' as const }
} as const;

// Default video configuration
export const DEFAULT_VIDEO_CONFIG = {
  autoPlay: false,
  showControls: true,
  preload: 'metadata' as const,
  crossOrigin: 'anonymous' as const,
  retryAttempts: 3,
  retryDelay: 2000, // milliseconds
  cacheTimeout: 300000 // 5 minutes
};

export default VIDEO_LIST;