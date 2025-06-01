import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Eye, 
  Settings, 
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { VideoUpload } from '@/components/VideoUpload';
import { VideoMigration } from '@/components/VideoMigration';
import { r2Storage, R2VideoMetadata } from '@/lib/r2Storage';
import { VIDEO_LIST } from '@/constants/videos';
import { cn } from '@/lib/utils';

interface VideoManagerProps {
  className?: string;
}

export const VideoManager: React.FC<VideoManagerProps> = ({ className }) => {
  const [videos, setVideos] = useState<R2VideoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'list' | 'upload' | 'migrate'>('list');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    loadExistingVideos();
  }, []);

  const loadExistingVideos = async () => {
    setIsLoading(true);
    try {
      // Load metadata for existing videos from the VIDEO_LIST
      const videoPromises = VIDEO_LIST.map(async (video) => {
        const key = video.url.split('/').pop() || '';
        const metadata = await r2Storage.getVideoMetadata(key);
        return metadata;
      });

      const results = await Promise.allSettled(videoPromises);
      const validVideos = results
        .filter((result): result is PromiseFulfilledResult<R2VideoMetadata> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      setVideos(validVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = (metadata: R2VideoMetadata) => {
    setVideos(prev => [...prev, metadata]);
    console.log('Video uploaded successfully:', metadata);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (date?: Date): string => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Video Manager</h2>
          <p className="text-gray-600">Manage your R2-hosted video content</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadExistingVideos}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Refresh
          </button>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveSection('list')}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition-colors",
                activeSection === 'list' 
                  ? "bg-white text-royalBlue-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveSection('upload')}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition-colors",
                activeSection === 'upload' 
                  ? "bg-white text-royalBlue-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveSection('migrate')}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition-colors",
                activeSection === 'migrate' 
                  ? "bg-white text-royalBlue-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Migrate
            </button>
          </div>
        </div>
      </div>

      {/* R2 Configuration Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">Cloudflare R2 Configuration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-700"><strong>Account ID:</strong> 313333285e943bbbd67e79b824551b47</p>
            <p className="text-blue-700"><strong>Bucket:</strong> lfai-video-demo</p>
          </div>
          <div>
            <p className="text-blue-700"><strong>Endpoint:</strong> https://313333285e943bbbd67e79b824551b47.r2.cloudflarestorage.com</p>
            <p className="text-blue-700">
              <strong>Status:</strong> 
              <span className={cn(
                "ml-1 px-2 py-1 rounded text-xs",
                r2Storage.isConfigured() 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              )}>
                {r2Storage.isConfigured() ? 'Configured' : 'Not Configured'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === 'upload' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Videos</h3>
          <VideoUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            maxFileSize={200 * 1024 * 1024} // 200MB
          />
        </div>
      )}

      {activeSection === 'migrate' && (
        <VideoMigration />
      )}

      {/* Videos List */}
      {activeSection === 'list' && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Current Videos ({videos.length})
            </h3>
          </div>

          {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-2">No videos found</p>
            <p className="text-sm text-gray-500">Upload some videos to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {videos.map((video, index) => (
              <div key={video.key} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {video.metadata?.originalName || video.key}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">Key: {video.key}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Size: {formatFileSize(video.size)}</span>
                      <span>Type: {video.contentType}</span>
                      {video.lastModified && (
                        <span>Modified: {formatDate(video.lastModified)}</span>
                      )}
                    </div>

                    {/* URL with copy button */}
                    <div className="mt-3 flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {video.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(video.url)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        {copiedUrl === video.url ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedUrl === video.url ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => window.open(video.url, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="View video"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = video.url;
                        link.download = video.metadata?.originalName || video.key;
                        link.click();
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="Download video"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => window.open(video.url, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      )}

      {/* Setup Instructions */}
      {!r2Storage.isConfigured() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-3">Setup Instructions</h3>
          <div className="space-y-3 text-sm text-yellow-700">
            <p><strong>1. Create API Token:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Go to Cloudflare Dashboard → R2 Object Storage</li>
              <li>Click "Manage R2 API tokens"</li>
              <li>Create a new API token with R2 permissions</li>
            </ul>
            
            <p><strong>2. Create R2 Bucket:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Create a bucket named "lfai-video-demo"</li>
              <li>Configure public access if needed</li>
            </ul>
            
            <p><strong>3. Update Environment Variables:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Add VITE_R2_ACCESS_KEY_ID to your .env file</li>
              <li>Add VITE_R2_SECRET_ACCESS_KEY to your .env file</li>
              <li>Restart your development server</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManager;