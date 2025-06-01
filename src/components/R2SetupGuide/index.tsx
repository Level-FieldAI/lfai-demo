import React, { useState } from 'react';
import { 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  AlertCircle, 
  Settings,
  Database,
  Key,
  Upload
} from 'lucide-react';
import { MigrationStatus } from '@/components/MigrationStatus';
import { cn } from '@/lib/utils';

interface R2SetupGuideProps {
  className?: string;
}

export const R2SetupGuide: React.FC<R2SetupGuideProps> = ({ className }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Create Cloudflare R2 Bucket',
      icon: Database,
      description: 'Set up your R2 storage bucket for video hosting',
      steps: [
        'Go to Cloudflare Dashboard → R2 Object Storage',
        'Click "Create bucket"',
        'Name your bucket: "lfai-video-demo"',
        'Choose your preferred location',
        'Click "Create bucket"'
      ],
      code: null,
      link: 'https://dash.cloudflare.com/r2'
    },
    {
      id: 2,
      title: 'Generate API Tokens',
      icon: Key,
      description: 'Create API credentials for programmatic access',
      steps: [
        'In R2 dashboard, click "Manage R2 API tokens"',
        'Click "Create API token"',
        'Give it a name like "LFAI Video Demo"',
        'Set permissions to "Object Read and Write"',
        'Optionally restrict to your bucket',
        'Click "Create API token"',
        'Copy the Access Key ID and Secret Access Key'
      ],
      code: null,
      link: 'https://dash.cloudflare.com/profile/api-tokens'
    },
    {
      id: 3,
      title: 'Configure Environment Variables',
      icon: Settings,
      description: 'Add your R2 credentials to the application',
      steps: [
        'Open your .env file in the project root',
        'Add the following environment variables:',
        'Replace the placeholder values with your actual credentials',
        'Restart your development server'
      ],
      code: `# Cloudflare R2 Configuration
VITE_R2_ACCESS_KEY_ID=your_access_key_id_here
VITE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here`,
      link: null
    },
    {
      id: 4,
      title: 'Configure Bucket Permissions (Optional)',
      icon: Settings,
      description: 'Set up public access for direct video streaming',
      steps: [
        'Go to your R2 bucket settings',
        'Navigate to "Settings" → "Public access"',
        'Enable "Allow public access" if you want direct video URLs',
        'Configure CORS settings for web access:',
        'Save the configuration'
      ],
      code: `{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}`,
      link: null
    },
    {
      id: 5,
      title: 'Upload Your Videos',
      icon: Upload,
      description: 'Transfer your existing videos to R2',
      steps: [
        'Use the Video Manager component to upload videos',
        'Or use the Cloudflare dashboard to upload manually',
        'Organize videos in folders (e.g., /videos/)',
        'Update your video configuration with new URLs',
        'Test video playback'
      ],
      code: `// Updated video URLs will look like:
https://313333285e943bbbd67e79b824551b47.r2.cloudflarestorage.com/lfai-video-demo/videos/Bruin_Video.mp4`,
      link: null
    }
  ];

  return (
    <div className={cn("max-w-4xl mx-auto space-y-8", className)}>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Cloudflare R2 Setup Guide
        </h1>
        <p className="text-lg text-gray-600">
          Follow these steps to migrate your video storage to Cloudflare R2
        </p>
      </div>

      {/* Benefits Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Why Cloudflare R2?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-blue-800">Zero egress fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-blue-800">Global CDN performance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-blue-800">S3-compatible API</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-blue-800">99.9% uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-blue-800">Automatic scaling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-blue-800">Built-in security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Steps */}
      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-royalBlue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-royalBlue-600" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Step {step.id}: {step.title}
                    </h3>
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-royalBlue-600 hover:text-royalBlue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </a>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-4">
                    {step.steps.map((stepText, stepIndex) => (
                      <li key={stepIndex}>{stepText}</li>
                    ))}
                  </ol>
                  
                  {step.code && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Configuration
                        </span>
                        <button
                          onClick={() => copyToClipboard(step.code!)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copiedText === step.code ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copiedText === step.code ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="text-sm text-gray-800 overflow-x-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Keep your API credentials secure and never commit them to version control</li>
              <li>• R2 charges for storage and operations, but has no egress fees</li>
              <li>• Consider setting up a custom domain for better branding</li>
              <li>• Enable versioning if you need to track video changes</li>
              <li>• Set up lifecycle policies to manage storage costs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Migration Status */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Current Migration Status</h2>
        <MigrationStatus />
      </div>

      {/* Next Steps */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-800 mb-3">After Setup</h3>
        <div className="space-y-2 text-sm text-green-700">
          <p>✓ Your videos will be served from Cloudflare's global CDN</p>
          <p>✓ You'll have better reliability and performance</p>
          <p>✓ The video upload component will be fully functional</p>
          <p>✓ You can manage videos through the Video Manager interface</p>
        </div>
      </div>
    </div>
  );
};

export default R2SetupGuide;