// This component has been removed as part of video system cleanup

interface MigrationStatusProps {
  className?: string;
}

interface VideoStatus {
  title: string;
  originalUrl: string;
  currentUrl: string;
  isR2: boolean;
  isAccessible: boolean;
  error?: string;
}

export const MigrationStatus: React.FC<MigrationStatusProps> = ({ className }) => {
  const [videoStatuses, setVideoStatuses] = useState<VideoStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [r2Configured, setR2Configured] = useState(false);

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    setIsLoading(true);
    setR2Configured(r2Storage.isConfigured());

    const statuses: VideoStatus[] = [];

    for (const video of VIDEO_LIST) {
      const isR2 = video.url.includes('.r2.cloudflarestorage.com');
      let isAccessible = false;
      let error: string | undefined;

      try {
        const response = await fetch(video.url, { method: 'HEAD' });
        isAccessible = response.ok;
        if (!response.ok) {
          error = `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (err) {
        error = err instanceof Error ? err.message : 'Network error';
      }

      statuses.push({
        title: video.title,
        originalUrl: video.url,
        currentUrl: video.url,
        isR2,
        isAccessible,
        error
      });
    }

    setVideoStatuses(statuses);
    setIsLoading(false);
  };

  const r2Videos = videoStatuses.filter(v => v.isR2);
  const legacyVideos = videoStatuses.filter(v => !v.isR2);
  const inaccessibleVideos = videoStatuses.filter(v => !v.isAccessible);

  const getStatusIcon = (video: VideoStatus) => {
    if (video.isAccessible && video.isR2) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (video.isAccessible && !video.isR2) {
      return <Clock className="w-5 h-5 text-yellow-600" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = (video: VideoStatus) => {
    if (video.isAccessible && video.isR2) {
      return 'Migrated to R2';
    } else if (video.isAccessible && !video.isR2) {
      return 'Legacy hosting';
    } else {
      return 'Inaccessible';
    }
  };

  const getStatusColor = (video: VideoStatus) => {
    if (video.isAccessible && video.isR2) {
      return 'text-green-700 bg-green-50 border-green-200';
    } else if (video.isAccessible && !video.isR2) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    } else {
      return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  if (isLoading) {
    return (
      <div className={cn("bg-white border border-gray-200 rounded-lg p-6", className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900">{videoStatuses.length}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              📹
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">R2 Migrated</p>
              <p className="text-2xl font-bold text-green-600">{r2Videos.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Legacy Hosting</p>
              <p className="text-2xl font-bold text-yellow-600">{legacyVideos.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issues</p>
              <p className="text-2xl font-bold text-red-600">{inaccessibleVideos.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Status</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {r2Configured ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={cn(
              "font-medium",
              r2Configured ? "text-green-700" : "text-red-700"
            )}>
              R2 Configuration: {r2Configured ? 'Configured' : 'Not Configured'}
            </span>
          </div>
          
          {!r2Configured && (
            <div className="ml-8 text-sm text-gray-600">
              <p>Environment variables missing. Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run setup:r2</code></p>
            </div>
          )}
        </div>
      </div>

      {/* Video Status List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Video Status Details</h3>
          <button
            onClick={checkMigrationStatus}
            className="text-sm text-royalBlue-600 hover:text-royalBlue-700 font-medium"
          >
            Refresh Status
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {videoStatuses.map((video, index) => (
            <div key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(video)}
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      getStatusColor(video)
                    )}>
                      {getStatusText(video)}
                    </span>
                    
                    {video.isR2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Cloudflare R2
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="truncate">URL: {video.currentUrl}</p>
                    {video.error && (
                      <p className="text-red-600 mt-1">Error: {video.error}</p>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  <a
                    href={video.currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration Recommendations */}
      {legacyVideos.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-3">Migration Recommendations</h3>
          <div className="space-y-2 text-sm text-yellow-700">
            <p>
              <strong>{legacyVideos.length} video{legacyVideos.length !== 1 ? 's' : ''}</strong> {legacyVideos.length !== 1 ? 'are' : 'is'} still using legacy hosting.
            </p>
            <p>Consider migrating to Cloudflare R2 for:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Better performance and reliability</li>
              <li>Lower costs (no egress fees)</li>
              <li>Global CDN distribution</li>
              <li>Improved security and access control</li>
            </ul>
            <p className="mt-3">
              Use the <strong>Video Manager → Migrate</strong> section to start the migration process.
            </p>
          </div>
        </div>
      )}

      {inaccessibleVideos.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-3">Issues Detected</h3>
          <div className="space-y-2 text-sm text-red-700">
            <p>
              <strong>{inaccessibleVideos.length} video{inaccessibleVideos.length !== 1 ? 's' : ''}</strong> {inaccessibleVideos.length !== 1 ? 'are' : 'is'} currently inaccessible.
            </p>
            <p>This may be due to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Network connectivity issues</li>
              <li>Server downtime or maintenance</li>
              <li>Incorrect URLs or moved content</li>
              <li>Access permission changes</li>
            </ul>
            <p className="mt-3">
              Consider migrating these videos to Cloudflare R2 for better reliability.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MigrationStatus;