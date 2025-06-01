import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Copy
} from 'lucide-react';
import { 
  migrateAllVideos, 
  testR2Connection, 
  generateUpdatedVideoConfig,
  MigrationProgress 
} from '@/utils/videoMigration';
import { cn } from '@/lib/utils';

interface VideoMigrationProps {
  className?: string;
}

export const VideoMigration: React.FC<VideoMigrationProps> = ({ className }) => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | null>(null);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  const [copiedConfig, setCopiedConfig] = useState(false);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    
    try {
      const result = await testR2Connection();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleStartMigration = async () => {
    setIsMigrating(true);
    setMigrationProgress(null);
    setMigrationComplete(false);
    setGeneratedConfig('');
    
    try {
      const result = await migrateAllVideos((progress) => {
        setMigrationProgress(progress);
      });
      
      if (result.success || result.migratedVideos.length > 0) {
        const configCode = generateUpdatedVideoConfig(result.migratedVideos);
        setGeneratedConfig(configCode);
        setMigrationComplete(true);
      }
      
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const copyConfigToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedConfig);
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadConfig = () => {
    const blob = new Blob([generatedConfig], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'updated-videos.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Video Migration to Cloudflare R2
        </h3>
        <p className="text-gray-600 mb-6">
          Migrate your existing videos from the current hosting to Cloudflare R2 for better performance and reliability.
        </p>

        {/* Connection Test */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">1. Test R2 Connection</h4>
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isTestingConnection ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Test Connection
            </button>
          </div>

          {connectionResult && (
            <div className={cn(
              "p-3 rounded-lg border",
              connectionResult.success 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            )}>
              <div className="flex items-center gap-2">
                {connectionResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={cn(
                  "font-medium",
                  connectionResult.success ? "text-green-800" : "text-red-800"
                )}>
                  {connectionResult.success ? 'Connection successful!' : 'Connection failed'}
                </span>
              </div>
              {connectionResult.error && (
                <p className="text-red-700 text-sm mt-1">{connectionResult.error}</p>
              )}
            </div>
          )}
        </div>

        {/* Migration */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">2. Start Migration</h4>
            <button
              onClick={handleStartMigration}
              disabled={isMigrating || !connectionResult?.success}
              className="flex items-center gap-2 px-4 py-2 bg-royalBlue-600 hover:bg-royalBlue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isMigrating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isMigrating ? 'Migrating...' : 'Start Migration'}
            </button>
          </div>

          {!connectionResult?.success && (
            <p className="text-sm text-gray-500 mb-3">
              Please test the connection first before starting migration.
            </p>
          )}

          {migrationProgress && (
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Migration Progress</span>
                  <span className="text-sm text-gray-600">
                    {migrationProgress.completed + migrationProgress.failed} / {migrationProgress.total}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-royalBlue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((migrationProgress.completed + migrationProgress.failed) / migrationProgress.total) * 100}%` 
                    }}
                  />
                </div>
                
                {migrationProgress.current && (
                  <p className="text-sm text-gray-600">
                    Current: {migrationProgress.current}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-green-600">
                    ✓ Completed: {migrationProgress.completed}
                  </span>
                  {migrationProgress.failed > 0 && (
                    <span className="text-red-600">
                      ✗ Failed: {migrationProgress.failed}
                    </span>
                  )}
                </div>
              </div>

              {migrationProgress.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-medium text-red-800 mb-2">Errors:</h5>
                  <ul className="space-y-1 text-sm text-red-700">
                    {migrationProgress.errors.map((error, index) => (
                      <li key={index}>
                        <strong>{error.url}:</strong> {error.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {migrationComplete && generatedConfig && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">3. Migration Complete!</h4>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 mb-3">
                Your videos have been successfully migrated to Cloudflare R2. 
                Update your video configuration with the code below:
              </p>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Updated Configuration</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyConfigToClipboard}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedConfig ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copiedConfig ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadConfig}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                
                <pre className="text-sm text-gray-800 overflow-x-auto max-h-64 overflow-y-auto">
                  <code>{generatedConfig}</code>
                </pre>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Next steps:</strong>
                </p>
                <ol className="list-decimal list-inside text-yellow-700 text-sm mt-1 space-y-1">
                  <li>Copy the generated configuration</li>
                  <li>Replace the content in <code>src/constants/videos.ts</code></li>
                  <li>Test the videos in the Video Demos tab</li>
                  <li>Remove the old video hosting once confirmed working</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoMigration;