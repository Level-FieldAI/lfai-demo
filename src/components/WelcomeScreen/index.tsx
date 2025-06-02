import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';
import { AVATAR_CATEGORIES, AvatarUseCase } from '@/constants/avatars';
import { cn } from '@/lib/utils';
import LFAILogo from '/LFAI Dark Logo.png';

// Helper function to get emoji for avatar based on category and name
const getAvatarEmoji = (avatar: AvatarUseCase): string => {
  if (avatar.category === 'Sports') {
    return '🏀'; // Basketball for sports
  } else if (avatar.category === 'Real Estate') {
    return '🏠'; // House for real estate
  } else if (avatar.category === 'Concierge') {
    if (avatar.name.toLowerCase().includes('tour')) {
      return '🗺️'; // Map for tour guides
    } else if (avatar.name.toLowerCase().includes('financial')) {
      return '💰'; // Money for financial
    } else {
      return '🎩'; // Top hat for concierge
    }
  }
  return '👤'; // Default person emoji
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
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
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

  useEffect(() => {
    checkScrollPosition();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  return (
    <div className="relative">
      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4 px-4">
          <p className="text-sm text-gray-600 font-medium">
            Swipe or use arrows to browse
          </p>
          <div className="flex gap-2">
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
              <ChevronLeft className="w-4 h-4" />
            </button>
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
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="relative">
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
                onClick={() => onSelect(avatar)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(avatar);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={selectedAvatar.id === avatar.id}
                className={cn(
                  'flex-shrink-0 w-24 h-24 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 flex flex-col items-center justify-center text-center p-2 border-2 shadow-lg hover:shadow-xl snap-center touch-target',
                  selectedAvatar.id === avatar.id
                    ? 'border-gold-400 bg-gradient-to-br from-gold-50 to-royalBlue-50 shadow-gold-200'
                    : 'border-royalBlue-200 bg-white hover:border-royalBlue-300'
                )}
              >
                <span className="text-2xl mb-1" aria-hidden="true">{getAvatarEmoji(avatar)}</span>
                <span className="text-xs font-medium text-royalBlue-800 leading-tight">
                  {avatar.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Gradient fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-gradient-to-r from-royalBlue-500 to-royalBlue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gold-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-gradient-to-r from-royalBlue-500 to-royalBlue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gold-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        
        <div className="relative">
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
                onClick={() => onSelect(avatar)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(avatar);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={selectedAvatar.id === avatar.id}
                className={cn(
                  'flex-shrink-0 w-32 h-32 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 flex flex-col items-center justify-center text-center p-4 border-2 shadow-lg hover:shadow-xl snap-center',
                  selectedAvatar.id === avatar.id
                    ? 'border-gold-400 bg-gradient-to-br from-gold-50 to-royalBlue-50 shadow-gold-200'
                    : 'border-royalBlue-200 bg-white hover:border-royalBlue-300'
                )}
              >
                <span className="text-4xl mb-2" aria-hidden="true">{getAvatarEmoji(avatar)}</span>
                <span className="text-sm font-medium text-royalBlue-800">
                  {avatar.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface WelcomeScreenProps {
  selectedAvatar: AvatarUseCase;
  onAvatarSelect: (avatar: AvatarUseCase) => void;
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
  onStart: (params: { language: string; avatarUseCase: AvatarUseCase }) => void;
}

export default function WelcomeScreen({
  selectedAvatar,
  onAvatarSelect,
  selectedLanguage,
  onLanguageSelect,
  onStart
}: WelcomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'avatar' | 'privacy'>('avatar');

  const privacyFeatures = [
    {
      icon: '🔒',
      text: 'All video processing happens locally in your browser - no data is sent to external servers'
    },
    {
      icon: '🚫',
      text: 'No recording, storage, or transmission of your video feed'
    },
    {
      icon: '⚡',
      text: 'Real-time processing ensures immediate interaction without data retention'
    },
    {
      icon: '🛡️',
      text: 'Complete control over camera permissions - disable anytime through browser settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 md:p-6">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-royalBlue-600 via-royalBlue-700 to-royalBlue-800 text-white p-6 md:p-8 flex items-center justify-between">
          <div className="w-24 md:w-36 lg:w-48">
            <img 
              src={LFAILogo} 
              alt="Level-FieldAI Logo" 
              className="max-w-full max-h-16 object-contain" 
            />
          </div>
          <div className="text-center flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gold-200 bg-clip-text text-transparent">
              Level Field AI Avatar Experience
            </h1>
            <p className="text-lg md:text-xl text-royalBlue-100 font-medium">
              Choose your AI companion and start your interactive journey
            </p>
          </div>          <div className="w-24 md:w-36 lg:w-48"></div>        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-r from-royalBlue-50 to-gold-50 border-b border-royalBlue-200">
          <div className="flex justify-center">
            {[
              { id: 'avatar', label: 'Choose Avatar', icon: '🤖' },
              { id: 'privacy', label: 'Privacy & Security', icon: '🔒' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 border-b-2',
                  activeTab === tab.id
                    ? 'text-royalBlue-700 border-royalBlue-500 bg-white/70'
                    : 'text-gray-600 border-transparent hover:text-royalBlue-600 hover:bg-white/50'
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === 'avatar' && (
            <>
              <section className="mb-8" aria-labelledby="avatar-heading">
                <header className="text-center mb-6">
                  <h2 id="avatar-heading" className="font-bold text-2xl text-royalBlue-900 bg-gradient-to-r from-royalBlue-700 to-gold-600 bg-clip-text text-transparent">
                    Select Your AI Avatar
                  </h2>
                </header>
                
                <AvatarCarousel
                  avatars={Object.values(AVATAR_CATEGORIES).flat()}
                  selectedAvatar={selectedAvatar}
                  onSelect={onAvatarSelect}
                />
              </section>

              <section className="mb-8" aria-labelledby="language-heading">
                <header className="text-center mb-6">
                  <h2 id="language-heading" className="font-bold text-2xl text-royalBlue-900 bg-gradient-to-r from-royalBlue-700 to-gold-600 bg-clip-text text-transparent">
                    Choose Language
                  </h2>
                </header>
                
                <div className="flex justify-center">
                  <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
                    <SelectTrigger className="w-64 h-12 text-lg border-2 border-royalBlue-300 focus:border-gold-400 bg-white/80 backdrop-blur-sm">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="text-lg py-3">
                          <span className="flex items-center gap-3">
                            <span className="text-xl">{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>

              <div className="text-center">
                <Button
                  onClick={() => onStart({ language: selectedLanguage, avatarUseCase: selectedAvatar })}
                  size="lg"
                  className="bg-gradient-to-r from-royalBlue-600 to-royalBlue-700 hover:from-royalBlue-700 hover:to-royalBlue-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gold-300 text-lg"
                >
                  Start AI Experience
                </Button>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <section aria-labelledby="privacy-heading">
                <header className="text-center mb-6">
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
        </div>
      </div>
    </div>
  )
}