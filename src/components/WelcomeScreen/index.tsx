import { useState, useRef, useEffect } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/constants/languages';
import { AVATAR_CATEGORIES, DEFAULT_AVATAR, AvatarUseCase } from '@/constants/avatars';
import { cn } from '@/lib/utils';

// Video constants
const VIDEO_BASE_URL = 'https://level-field.ai/lfai-video-demo';
const VIDEO_LIST = [
  {
    title: 'Bruin Recruiting Video',
    url: `${VIDEO_BASE_URL}/Bruin_Video.mp4`,
    description: 'AI avatar demonstration for recruiting and HR applications'
  },
  {
    title: 'Cerebro Sports Video',
    url: `${VIDEO_BASE_URL}/Cerebro%20Demo.mp4`, // URL encoded space
    description: 'Sports analytics and coaching with AI avatars'
  },
  {
    title: 'Gregory CPA Video',
    url: `${VIDEO_BASE_URL}/gregory_cpa.mp4`,
    description: 'Professional services and consultation AI avatar demo'
  }
];

const TABS = [
  { key: 'cvi', label: 'CVI' },
  { key: 'video', label: 'Video Generation' }
];

const privacyFeatures = [
  {
    icon: '🔒',
    text: 'Your video feed is processed in real-time only; nothing is recorded or saved.'
  },
  {
    icon: '💻',
    text: 'Everything happens locally on your device. Your camera feed never leaves your computer.'
  },
  {
    icon: '🛡️',
    text: 'Our privacy-first design ensures your data stays yours, always.'
  }
];

const VideoPlayer = ({ video, index }: { video: typeof VIDEO_LIST[0], index: number }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Error loading video: ${video.url}`, e);
    setIsLoading(false);
    setHasError(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-royalBlue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-royalBlue-100 to-gold-100">
        {hasError ? (
          // Error state
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📹</div>
              <p className="font-medium mb-2">Video temporarily unavailable</p>
              <p className="text-sm text-gray-500 mb-3">This demo video is currently being updated</p>
              <button 
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  // Try to reload the video
                  const video = document.querySelector(`video[data-video-index="${index}"]`) as HTMLVideoElement;
                  if (video) {
                    video.load();
                  }
                }}
                className="px-4 py-2 bg-royalBlue-600 text-white rounded-lg hover:bg-royalBlue-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              data-video-index={index}
              controls
              preload="metadata"
              className="w-full h-full object-cover"
              poster={`https://placehold.co/400x225/4588FF/ffffff?text=AI+Avatar+Demo+${index + 1}`}
              onLoadStart={handleLoadStart}
              onCanPlay={handleCanPlay}
              onError={handleError}
              onPlay={handlePlay}
              onPause={handlePause}
              crossOrigin="anonymous"
            >
              <source src={video.url} type="video/mp4" />
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-royalBlue-100 to-gold-100 text-royalBlue-700">
                <div className="text-center p-4">
                  <p className="font-medium">Your browser does not support video playback.</p>
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-royalBlue-600 hover:text-royalBlue-800 underline mt-2 inline-block"
                  >
                    Download video instead
                  </a>
                </div>
              </div>
            </video>
            
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-royalBlue-100/90 to-gold-100/90 backdrop-blur-sm">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royalBlue-600 mb-3"></div>
                  <p className="text-royalBlue-700 font-medium">Loading video...</p>
                </div>
              </div>
            )}
            
            {/* Play button overlay */}
            {!isLoading && !isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-opacity duration-300">
                  <svg className="w-8 h-8 text-royalBlue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="text-center">
        <h4 className="text-lg font-bold text-royalBlue-800 mb-2">{video.title}</h4>
        <p className="text-sm text-gray-600 mb-3">
          {video.description}
        </p>
        
        {/* Video info badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-gradient-to-r from-royalBlue-100 to-royalBlue-200 text-royalBlue-700 text-xs font-medium rounded-full">
            AI Avatar
          </span>
          <span className="px-3 py-1 bg-gradient-to-r from-gold-100 to-gold-200 text-gold-700 text-xs font-medium rounded-full">
            Demo Video
          </span>
        </div>
      </div>
    </div>
  );
};

const AvatarCarousel = ({ avatars, selectedAvatar, onSelect }: {
  avatars: AvatarUseCase[];
  selectedAvatar: AvatarUseCase;
  onSelect: (avatar: AvatarUseCase) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Check scroll position on mount and when avatars change
  useEffect(() => {
    checkScrollPosition();
  }, [avatars]);

  return (
    <div className="relative w-full">
      {/* Mobile: Arrows positioned outside the scroll area */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => scroll('left')}
            disabled={!showLeftArrow}
            className={cn(
              "p-2 rounded-full bg-gradient-to-r from-royalBlue-500 to-royalBlue-600 text-white shadow-lg transition-all duration-300 border border-gold-300 touch-target",
              showLeftArrow 
                ? "hover:shadow-xl hover:scale-105 opacity-100" 
                : "opacity-50 cursor-not-allowed"
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-medium text-royalBlue-700">
            Swipe or use arrows to browse
          </span>
          
          <button
            onClick={() => scroll('right')}
            disabled={!showRightArrow}
            className={cn(
              "p-2 rounded-full bg-gradient-to-r from-royalBlue-500 to-royalBlue-600 text-white shadow-lg transition-all duration-300 border border-gold-300 touch-target",
              showRightArrow 
                ? "hover:shadow-xl hover:scale-105 opacity-100" 
                : "opacity-50 cursor-not-allowed"
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          {/* Gradient fade indicators */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-royalBlue-100 to-transparent z-10 pointer-events-none"></div>
          )}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gold-100 to-transparent z-10 pointer-events-none"></div>
          )}
          
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 px-4 py-4 snap-x snap-mandatory touch-scroll"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
            }}
            onScroll={checkScrollPosition}
          >
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={cn(
                  'flex-shrink-0 w-24 h-24 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 flex flex-col items-center justify-center text-center p-2 border-2 shadow-lg hover:shadow-xl snap-center touch-target',
                  selectedAvatar.id === avatar.id
                    ? 'ring-3 ring-gold-400 bg-gradient-to-br from-royalBlue-500 to-royalBlue-600 shadow-xl scale-105 border-gold-300 text-white'
                    : 'bg-gradient-to-br from-white via-royalBlue-50 to-gold-50 hover:from-royalBlue-100 hover:to-gold-100 border-royalBlue-200 hover:border-gold-300'
                )}
                onClick={() => onSelect(avatar)}
                role="button"
                aria-pressed={selectedAvatar.id === avatar.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(avatar);
                  }
                }}
              >
                <span className={cn(
                  'text-xs font-bold leading-tight',
                  selectedAvatar.id === avatar.id
                    ? 'text-gold-200'
                    : 'text-royalBlue-700'
                )}>
                  {avatar.name}
                </span>
                {selectedAvatar.id === avatar.id && (
                  <div className="w-1.5 h-1.5 bg-gold-300 rounded-full mt-1 animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Arrows positioned over the scroll area */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="flex items-center">
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-2 z-10 p-3 rounded-full bg-gradient-to-r from-royalBlue-500 to-royalBlue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-gold-300"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide space-x-6 px-16 py-6 snap-x snap-mandatory touch-scroll"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
              onScroll={checkScrollPosition}
            >
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className={cn(
                    'flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 flex flex-col items-center justify-center text-center p-3 border-3 shadow-lg hover:shadow-2xl snap-center',
                    selectedAvatar.id === avatar.id
                      ? 'ring-4 ring-gold-400 bg-gradient-to-br from-royalBlue-500 to-royalBlue-600 shadow-2xl scale-110 border-gold-300 text-white'
                      : 'bg-gradient-to-br from-white via-royalBlue-50 to-gold-50 hover:from-royalBlue-100 hover:to-gold-100 border-royalBlue-200 hover:border-gold-300'
                  )}
                  onClick={() => onSelect(avatar)}
                  role="button"
                  aria-pressed={selectedAvatar.id === avatar.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(avatar);
                    }
                  }}
                >
                  <span className={cn(
                    'text-sm font-bold leading-tight',
                    selectedAvatar.id === avatar.id
                      ? 'text-gold-200'
                      : 'text-royalBlue-700'
                  )}>
                    {avatar.name}
                  </span>
                  {selectedAvatar.id === avatar.id && (
                    <div className="w-2 h-2 bg-gold-300 rounded-full mt-2 animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-2 z-10 p-3 rounded-full bg-gradient-to-r from-royalBlue-500 to-royalBlue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-gold-300"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Types
interface WelcomeScreenProps {
  onStart: (config: { language: string; avatarUseCase: AvatarUseCase }) => void;
  loading: boolean;
}

export const WelcomeScreen = ({ onStart, loading }: WelcomeScreenProps) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE.value);
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [activeTab, setActiveTab] = useState('cvi');

  const allAvatars = Object.values(AVATAR_CATEGORIES).flat();

  const handleStart = () => {
    onStart({ language, avatarUseCase: selectedAvatar });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4 md:gap-6 p-4 sm:p-6 overflow-y-auto py-8'>
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Level-FieldAI Logo"
        className="w-36 md:w-48 mb-2 md:mb-4 object-contain"
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x64/cccccc/ffffff?text=Logo')}
      />

      {/* Headings */}
      <h2 className='text-xl md:text-3xl text-center font-bold text-royalBlue-800 max-w-2xl'>
        Level the Field with AI—Engage, Interact, and Explore
      </h2>
      <p className='text-base md:text-lg text-center text-gray-600 mb-6 max-w-xl'>
        Step into the Future of Engaging AI Conversations
      </p>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gradient-to-r from-royalBlue-100 to-gold-100 p-2 rounded-2xl border-2 border-gold-300 shadow-lg">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={cn(
              'px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105',
              activeTab === tab.key
                ? 'bg-gradient-to-r from-royalBlue-600 to-royalBlue-700 text-white shadow-xl border-2 border-gold-400 scale-105'
                : 'bg-white/70 text-royalBlue-600 hover:bg-gradient-to-r hover:from-royalBlue-50 hover:to-gold-50 hover:text-royalBlue-700 border-2 border-transparent hover:border-royalBlue-300 shadow-md'
            )}
            onClick={() => setActiveTab(tab.key)}
            aria-selected={activeTab === tab.key}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-4xl space-y-6 md:space-y-8 bg-gradient-to-br from-royalBlue-50 via-white to-gold-50 rounded-b-2xl shadow-xl border-2 border-gold-300 p-4 md:p-8">
        {activeTab === 'cvi' && (
          <>
            {/* Avatar Selection */}
            <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-3 md:p-6 border border-royalBlue-200 shadow-lg">
              <h3 className="text-lg md:text-xl font-bold text-royalBlue-800 text-center bg-gradient-to-r from-royalBlue-600 to-royalBlue-800 bg-clip-text text-transparent">
                Select Virtual Assistant
              </h3>
              <div className="bg-gradient-to-r from-royalBlue-100 to-gold-100 rounded-xl p-2 md:p-4 border border-gold-300">
                <AvatarCarousel
                  avatars={allAvatars}
                  selectedAvatar={selectedAvatar}
                  onSelect={setSelectedAvatar}
                />
              </div>
            </div>

            {/* Selected Avatar Display */}
            <div className="text-center py-6">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-royalBlue-600 to-royalBlue-700 text-white rounded-2xl px-8 py-4 shadow-xl border-2 border-gold-400 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gold-400 rounded-full animate-pulse"></div>
                  <div>
                    <span className="font-bold text-lg text-gold-100">{selectedAvatar.name}</span>
                    <p className="text-sm text-royalBlue-100 mt-1">{selectedAvatar.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="w-full max-w-sm mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gold-300 shadow-lg">
              <label htmlFor="language-select" className="block text-lg font-bold text-royalBlue-800 mb-4 text-center bg-gradient-to-r from-royalBlue-600 to-gold-600 bg-clip-text text-transparent">
                Conversation Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language-select" className="w-full border-2 border-royalBlue-300 focus:ring-4 focus:ring-gold-300 focus:border-gold-500 bg-gradient-to-r from-white to-royalBlue-50 text-royalBlue-800 font-semibold rounded-xl h-12">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="border-2 border-royalBlue-300 bg-white shadow-xl">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem 
                      key={`${lang.value}-${lang.label}`} 
                      value={lang.value}
                      className="hover:bg-gradient-to-r hover:from-royalBlue-50 hover:to-gold-50 focus:bg-gradient-to-r focus:from-royalBlue-100 focus:to-gold-100 text-royalBlue-800 font-medium"
                    >
                      {lang.flag} {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button 
                className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-royalBlue-600 via-royalBlue-700 to-royalBlue-800 hover:from-royalBlue-700 hover:via-royalBlue-800 hover:to-royalBlue-900 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-2 border-gold-400 hover:border-gold-300 relative overflow-hidden group" 
                onClick={handleStart} 
                disabled={loading}
              >
                <span className="relative z-10">
                  {loading ? 'Loading...' : 'Start Conversation'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-gold-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* Privacy Information */}
            <section 
              className="w-full max-w-2xl mx-auto bg-gradient-to-br from-royalBlue-50 via-white to-gold-50 p-8 rounded-3xl border-3 border-gold-400 shadow-2xl relative overflow-hidden"
              aria-labelledby="privacy-heading"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-royalBlue-500 via-gold-500 to-royalBlue-500"></div>
              
              <header className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full">
                  <ShieldCheck className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h2 id="privacy-heading" className="font-bold text-2xl text-royalBlue-900 bg-gradient-to-r from-royalBlue-700 to-gold-600 bg-clip-text text-transparent">
                  Camera Access & Privacy
                </h2>
              </header>
              
              <p className="text-royalBlue-800 mb-6 leading-relaxed text-lg font-medium">
                To enable interactive features with our AI avatar, camera access is required. 
                Your privacy remains our highest priority.
              </p>
              
              <ul className="space-y-4 mb-6" role="list">
                {privacyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-royalBlue-200 shadow-sm hover:shadow-md transition-shadow duration-200" role="listitem">
                    <span className="text-2xl" aria-hidden="true">{feature.icon}</span>
                    <span className="text-royalBlue-800 leading-relaxed font-medium">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-gradient-to-r from-gold-100 via-gold-50 to-royalBlue-50 p-6 rounded-2xl border-2 border-gold-300 shadow-inner">
                <p className="text-royalBlue-900 leading-relaxed font-medium">
                  The AI avatar processes video feed in real time for responsive interaction, 
                  with no data captured or saved. You may revoke camera permission at any time.
                </p>
              </div>
            </section>
          </>
        )}

        {activeTab === 'video' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-royalBlue-800 mb-4 bg-gradient-to-r from-royalBlue-600 to-royalBlue-800 bg-clip-text text-transparent">
                AI Avatar Video Generation
              </h3>
              <p className="text-lg text-gray-600 mb-2">
                Watch sample videos generated by our AI avatars
              </p>
              <p className="text-sm text-gray-500">
                Experience the future of AI-powered video content creation
              </p>
            </div>
            
            {/* Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                <p className="font-medium text-yellow-800 mb-2">Debug Info (Development Only):</p>
                <ul className="text-yellow-700 space-y-1">
                  {VIDEO_LIST.map((video, index) => (
                    <li key={index} className="font-mono text-xs">
                      {video.title}: {video.url}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {VIDEO_LIST.map((video, index) => (
                <VideoPlayer key={video.title} video={video} index={index} />
              ))}
            </div>
            
            {/* Additional info section */}
            <div className="w-full max-w-4xl bg-gradient-to-r from-royalBlue-50 via-white to-gold-50 rounded-2xl p-6 border-2 border-gold-300 shadow-lg">
              <div className="text-center">
                <h4 className="text-xl font-bold text-royalBlue-800 mb-3 bg-gradient-to-r from-royalBlue-600 to-gold-600 bg-clip-text text-transparent">
                  About Our AI Video Generation
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  These videos showcase the capabilities of our AI avatar technology. Each video demonstrates 
                  realistic facial expressions, natural speech patterns, and lifelike interactions powered by 
                  advanced machine learning algorithms.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white/70 rounded-xl border border-royalBlue-200">
                  <div className="text-2xl mb-2">🎭</div>
                  <h5 className="font-semibold text-royalBlue-800 mb-1">Realistic Expressions</h5>
                  <p className="text-sm text-gray-600">Natural facial movements and emotions</p>
                </div>
                <div className="text-center p-4 bg-white/70 rounded-xl border border-royalBlue-200">
                  <div className="text-2xl mb-2">🗣️</div>
                  <h5 className="font-semibold text-royalBlue-800 mb-1">Natural Speech</h5>
                  <p className="text-sm text-gray-600">Human-like voice synthesis and lip sync</p>
                </div>
                <div className="text-center p-4 bg-white/70 rounded-xl border border-royalBlue-200">
                  <div className="text-2xl mb-2">⚡</div>
                  <h5 className="font-semibold text-royalBlue-800 mb-1">Real-time Generation</h5>
                  <p className="text-sm text-gray-600">Instant video creation and interaction</p>
                </div>
              </div>
            </div>
            
            {/* Fallback message if videos don't load */}
            <div className="text-center text-gray-500 text-sm">
              <p>Having trouble viewing videos? 
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-royalBlue-600 hover:text-royalBlue-800 underline ml-1"
                >
                  Try refreshing the page
                </button>
              </p>
              <p className="mt-2 text-xs">
                Videos are hosted externally and may take a moment to load
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}