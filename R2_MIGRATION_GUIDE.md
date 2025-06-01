# Cloudflare R2 Video Migration Guide

This guide will help you migrate your video hosting from the current solution to Cloudflare R2 for better performance, reliability, and cost-effectiveness.

## Overview

The migration includes:
- **R2 Storage Service**: S3-compatible API integration for Cloudflare R2
- **Video Upload Component**: Drag-and-drop interface for uploading videos
- **Video Manager**: Admin interface for managing R2-hosted videos
- **Migration Tool**: Automated migration from existing video URLs
- **Setup Guide**: Step-by-step R2 configuration instructions

## Prerequisites

1. **Cloudflare Account** with R2 enabled
2. **R2 Bucket** created (recommended name: `lfai-video-demo`)
3. **API Tokens** with R2 permissions
4. **Environment Variables** configured

## Step 1: Cloudflare R2 Setup

### 1.1 Create R2 Bucket
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click **Create bucket**
4. Name: `lfai-video-demo`
5. Choose your preferred location
6. Configure public access settings as needed

### 1.2 Create API Token
1. In R2 dashboard, click **Manage R2 API tokens**
2. Click **Create API token**
3. Configure permissions:
   - **Account**: Your account
   - **Zone Resources**: Include All zones
   - **Account Resources**: Include All accounts
   - **Permissions**: 
     - Account: `Cloudflare R2:Edit`
4. Copy the **Access Key ID** and **Secret Access Key**

### 1.3 Configure Environment Variables
Add these to your `.env` file:

```env
# Cloudflare R2 Configuration
VITE_R2_ACCESS_KEY_ID=your_access_key_id_here
VITE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
```

**Important**: Restart your development server after adding environment variables.

## Step 2: Install Dependencies

The required dependencies are already included in `package.json`:

```bash
npm install
# or
yarn install
```

Dependencies added:
- `@aws-sdk/client-s3`: S3-compatible client for R2
- `@aws-sdk/s3-request-presigner`: For generating signed URLs

## Step 3: Migration Process

### 3.1 Access the Migration Tool
1. Start your development server: `npm run dev`
2. Open the application
3. Navigate to **Video Manager** tab
4. Click on **Migrate** section

### 3.2 Test R2 Connection
1. Click **Test Connection** button
2. Verify successful connection to R2
3. Fix any configuration issues if the test fails

### 3.3 Run Migration
1. Click **Start Migration** button
2. Monitor progress as videos are downloaded and uploaded
3. Review any errors that occur during migration
4. Copy the generated configuration code

### 3.4 Update Video Configuration
1. Open `src/constants/videos.ts`
2. Replace the existing `VIDEO_LIST` with the generated configuration
3. Save the file
4. Test video playback in the **Video Demos** tab

## Step 4: Verification

### 4.1 Test Video Playback
1. Go to **Video Demos** tab
2. Try playing different videos
3. Verify thumbnails load correctly
4. Check video quality and loading speed

### 4.2 Test Upload Functionality
1. Go to **Video Manager** → **Upload** section
2. Upload a test video file
3. Verify it appears in the video list
4. Test playback of the uploaded video

## Configuration Details

### R2 Storage Service (`src/lib/r2Storage.ts`)

The `R2StorageService` class provides:

- **Upload videos**: `uploadVideo(file, key, options)`
- **Get metadata**: `getVideoMetadata(key)`
- **Generate URLs**: `getPublicUrl(key)`, `getSignedVideoUrl(key)`
- **Test connection**: `testConnection()`

### Video Configuration (`src/constants/videos.ts`)

Updated to use R2 endpoints:
- **Base URL**: `https://313333285e943bbbd67e79b824551b47.r2.cloudflarestorage.com`
- **Bucket**: `lfai-video-demo`
- **CDN**: Automatic R2 CDN optimization

### Environment Variables

Required variables:
```env
VITE_R2_ACCESS_KEY_ID=your_access_key_id
VITE_R2_SECRET_ACCESS_KEY=your_secret_access_key
```

## Troubleshooting

### Common Issues

#### 1. Connection Test Fails
- **Check credentials**: Verify access key ID and secret access key
- **Check permissions**: Ensure API token has R2 edit permissions
- **Check bucket**: Verify bucket exists and is accessible
- **Restart server**: Environment variables require server restart

#### 2. Migration Fails
- **Network issues**: Check internet connection
- **File access**: Verify original video URLs are accessible
- **Bucket permissions**: Ensure write permissions to R2 bucket
- **File size**: Check if videos exceed R2 limits

#### 3. Videos Don't Play
- **CORS settings**: Configure CORS on R2 bucket if needed
- **Public access**: Ensure bucket allows public read access
- **URL format**: Verify generated URLs are correct

#### 4. Upload Issues
- **File format**: Only MP4 files are supported
- **File size**: Check file size limits (default: 200MB)
- **Browser support**: Ensure modern browser with File API support

### Debug Steps

1. **Check browser console** for error messages
2. **Verify environment variables** are loaded correctly
3. **Test R2 connection** using the built-in test tool
4. **Check network tab** for failed requests
5. **Verify bucket configuration** in Cloudflare dashboard

## Performance Optimization

### R2 CDN
- Automatic CDN distribution for faster global access
- Edge caching reduces latency
- Bandwidth optimization

### Video Optimization
- Use optimized video formats (H.264/MP4)
- Consider multiple quality levels for adaptive streaming
- Implement lazy loading for thumbnails

### Caching Strategy
- Browser caching for static video content
- CDN edge caching for global distribution
- Metadata caching for faster load times

## Security Considerations

### Access Control
- Use signed URLs for private content
- Configure bucket permissions appropriately
- Rotate API tokens regularly

### Content Protection
- Enable CORS only for your domain
- Use HTTPS for all video URLs
- Consider watermarking for sensitive content

## Cost Optimization

### R2 Pricing Benefits
- No egress fees for most use cases
- Competitive storage costs
- Pay-per-use model

### Usage Monitoring
- Monitor storage usage in Cloudflare dashboard
- Track bandwidth usage
- Set up billing alerts

## Next Steps

1. **Monitor performance** after migration
2. **Set up monitoring** for R2 usage and costs
3. **Configure CDN settings** for optimal performance
4. **Implement backup strategy** for video content
5. **Consider video optimization** for different devices/connections

## Support

For issues with:
- **Cloudflare R2**: Check [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- **AWS SDK**: Check [AWS SDK for JavaScript Documentation](https://docs.aws.amazon.com/sdk-for-javascript/)
- **Application issues**: Check browser console and network tab for errors

## Migration Checklist

- [ ] Cloudflare R2 bucket created
- [ ] API tokens generated with correct permissions
- [ ] Environment variables configured
- [ ] Development server restarted
- [ ] R2 connection test passed
- [ ] Video migration completed successfully
- [ ] Video configuration updated
- [ ] Video playback tested
- [ ] Upload functionality tested
- [ ] Performance verified
- [ ] Old hosting can be safely removed

---

**Note**: Keep your original video hosting active until you've fully verified the R2 migration is working correctly.