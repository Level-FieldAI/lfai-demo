# Tavus CVI Integration Guide

This document explains how to integrate and use the Tavus CVI (Conversational Video Interface) player in your Level-FieldAI application.

## 🚀 Quick Start

### Option 1: React Component Integration (Recommended)

1. **Update CVI ID**: Edit `src/config/tavus.ts` and replace the `CVI_ID` with your actual Tavus CVI ID:
   ```typescript
   export const TAVUS_CONFIG = {
     CVI_ID: "your_actual_cvi_id_here", // Replace this
     // ... other config
   };
   ```

2. **Access CVI Demo**: 
   - Start your development server: `npm run dev`
   - Go to the welcome screen
   - Click "Try Tavus CVI Demo" button

### Option 2: Standalone HTML Page

1. **Update CVI ID**: Edit `public/js/tavus-cvi.js` and replace the `cviId`:
   ```javascript
   const cviId = 'your_actual_cvi_id_here'; // Replace this
   ```

2. **Access Demo**: Navigate to `/cvi-demo.html` in your browser

### Option 3: URL Parameter

Access the CVI demo directly by adding `?demo=cvi` to your URL:
```
http://localhost:5173/?demo=cvi
```

## 📁 File Structure

```
├── public/
│   ├── css/tavus-cvi.css          # CVI player styles
│   ├── js/tavus-cvi.js            # Standalone CVI JavaScript
│   └── cvi-demo.html              # Standalone demo page
├── src/
│   ├── components/
│   │   ├── TavusCVIPlayer.tsx     # React CVI component
│   │   └── CVIDemo.tsx            # Demo page component
│   └── config/
│       └── tavus.ts               # CVI configuration
```

## 🔧 Configuration

### Main Configuration File: `src/config/tavus.ts`

```typescript
export const TAVUS_CONFIG = {
  CVI_ID: "your_cvi_id_here",
  SDK_URL: "https://cdn.tavus.io/sdk/tavus-sdk.js",
  PLAYER_CONFIG: {
    transparentBackground: true,
    autoplay: true,
    loop: true,
    controls: false,
    mute: true,
    width: '100%',
    height: '100%'
  }
};
```

### Player Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cviId` | string | required | Your Tavus CVI ID |
| `transparentBackground` | boolean | true | Enable transparent background |
| `autoplay` | boolean | true | Auto-start video playback |
| `loop` | boolean | true | Loop video playback |
| `controls` | boolean | false | Show video controls |
| `mute` | boolean | true | Start muted (required for autoplay) |

## 🎯 Usage Examples

### Basic React Component Usage

```tsx
import TavusCVIPlayer from '@/components/TavusCVIPlayer';

function MyComponent() {
  const handleReady = () => {
    console.log('CVI Player is ready!');
  };

  const handleError = (error) => {
    console.error('CVI Player error:', error);
  };

  return (
    <TavusCVIPlayer
      cviId="your_cvi_id_here"
      className="w-full h-screen"
      onReady={handleReady}
      onError={handleError}
    />
  );
}
```

### Advanced Usage with Controls

```tsx
import { useRef } from 'react';
import TavusCVIPlayer from '@/components/TavusCVIPlayer';

function AdvancedCVIDemo() {
  const playerRef = useRef();

  const playVideo = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  return (
    <div>
      <div className="controls">
        <button onClick={playVideo}>Play</button>
        <button onClick={pauseVideo}>Pause</button>
      </div>
      
      <TavusCVIPlayer
        ref={playerRef}
        cviId="your_cvi_id_here"
        autoplay={false}
        controls={true}
      />
    </div>
  );
}
```

## 🎨 Styling

The CVI player comes with pre-built styles in `public/css/tavus-cvi.css`. Key classes:

- `.cvi-container` - Main container
- `.loading-indicator` - Loading state
- `.cvi-error` - Error state
- `.cvi-ready` - Ready state
- `.content-behind` - Background content

### Custom Styling Example

```css
.my-cvi-player {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.my-cvi-player .loading-indicator {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-weight: bold;
}
```

## 🔍 Debugging

### Browser Console

The CVI player provides detailed console logging:

```javascript
// Check player status
console.log('CVI Player Status:', window.TavusCVIUtils.getStatus());

// Access player instance
console.log('CVI Player:', window.cviPlayer);
```

### Common Issues

1. **"Invalid CVI ID" Error**
   - Ensure your CVI ID starts with `cvi_`
   - Verify the ID is correct in your Tavus dashboard

2. **"Failed to load Tavus SDK" Error**
   - Check your internet connection
   - Verify the SDK URL is correct
   - Check browser console for network errors

3. **Player Not Showing**
   - Ensure the container has proper dimensions
   - Check CSS z-index conflicts
   - Verify the CVI ID is valid

## 🚀 Deployment

### Environment Variables (Optional)

For production deployments, you can use environment variables:

```typescript
// src/config/tavus.ts
export const TAVUS_CONFIG = {
  CVI_ID: import.meta.env.VITE_TAVUS_CVI_ID || "fallback_cvi_id",
  // ... other config
};
```

Then set in your `.env` file:
```
VITE_TAVUS_CVI_ID=your_production_cvi_id
```

### Build Considerations

- Ensure `public/css/tavus-cvi.css` is included in your build
- Verify `public/js/tavus-cvi.js` is accessible for standalone usage
- Test the CVI player in your production environment

## 📞 Support

For Tavus-specific issues:
- Check the [Tavus Documentation](https://docs.tavus.io)
- Contact Tavus Support

For integration issues:
- Check the browser console for errors
- Verify your CVI ID configuration
- Test with the standalone HTML demo first

## 🔄 Updates

To update the Tavus SDK:
1. Check for new SDK versions in Tavus documentation
2. Update the `SDK_URL` in `src/config/tavus.ts`
3. Test thoroughly before deploying

---

**Note**: Replace all placeholder CVI IDs with your actual Tavus CVI ID before using in production.