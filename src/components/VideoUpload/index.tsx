import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { r2Storage, R2VideoMetadata } from '@/lib/r2Storage';
import { cn } from '@/lib/utils';

interface VideoUploadProps {
  onUploadComplete?: (metadata: R2VideoMetadata) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  maxFileSize?: number; // in bytes
  acceptedFormats?: string[];
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: R2VideoMetadata;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  onUploadComplete,
  onUploadError,
  className,
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  acceptedFormats = ['video/mp4', 'video/webm', 'video/mov', 'video/avi']
}) => {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateVideoKey = (file: File): string => {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `videos/${timestamp}_${sanitizedName}`;
  };

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `File type ${file.type} is not supported. Accepted formats: ${acceptedFormats.join(', ')}`;
    }

    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const fileId = `${file.name}_${Date.now()}`;
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setUploads(prev => new Map(prev.set(fileId, {
        file,
        progress: 0,
        status: 'error',
        error: validationError
      })));
      onUploadError?.(validationError);
      return;
    }

    // Check if R2 is configured
    if (!r2Storage.isConfigured()) {
      const error = 'R2 storage is not properly configured. Please check your environment variables.';
      setUploads(prev => new Map(prev.set(fileId, {
        file,
        progress: 0,
        status: 'error',
        error
      })));
      onUploadError?.(error);
      return;
    }

    // Initialize upload progress
    setUploads(prev => new Map(prev.set(fileId, {
      file,
      progress: 0,
      status: 'uploading'
    })));

    try {
      const videoKey = generateVideoKey(file);
      
      // Simulate progress (since we don't have real progress from R2)
      const progressInterval = setInterval(() => {
        setUploads(prev => {
          const current = prev.get(fileId);
          if (current && current.status === 'uploading' && current.progress < 90) {
            return new Map(prev.set(fileId, {
              ...current,
              progress: Math.min(current.progress + 10, 90)
            }));
          }
          return prev;
        });
      }, 200);

      const metadata = await r2Storage.uploadVideo(file, videoKey, {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size.toString()
        },
        cacheControl: 'public, max-age=31536000' // 1 year cache
      });

      clearInterval(progressInterval);

      // Complete upload
      setUploads(prev => new Map(prev.set(fileId, {
        file,
        progress: 100,
        status: 'completed',
        metadata
      })));

      onUploadComplete?.(metadata);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploads(prev => new Map(prev.set(fileId, {
        file,
        progress: 0,
        status: 'error',
        error: errorMessage
      })));

      onUploadError?.(errorMessage);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      uploadFile(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeUpload = (fileId: string) => {
    setUploads(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver 
            ? "border-royalBlue-500 bg-royalBlue-50" 
            : "border-gray-300 hover:border-royalBlue-400"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Video Files
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop video files here, or click to select files
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: MP4, WebM, MOV, AVI (max {Math.round(maxFileSize / (1024 * 1024))}MB)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploads.size > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Upload Progress</h4>
          {Array.from(uploads.entries()).map(([fileId, upload]) => (
            <div
              key={fileId}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {upload.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-royalBlue-600 animate-spin" />
                  )}
                  {upload.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-900">{upload.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(upload.file.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeUpload(fileId)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              {upload.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-royalBlue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}

              {/* Status Messages */}
              {upload.status === 'completed' && upload.metadata && (
                <div className="text-sm text-green-600">
                  ✓ Uploaded successfully to: {upload.metadata.key}
                </div>
              )}

              {upload.status === 'error' && upload.error && (
                <div className="text-sm text-red-600">
                  ✗ {upload.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* R2 Configuration Status */}
      {!r2Storage.isConfigured() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">R2 Not Configured</p>
              <p className="text-sm text-yellow-700">
                Please add your R2 API credentials to the environment variables to enable video uploads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;