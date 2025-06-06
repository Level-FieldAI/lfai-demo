import { useState } from 'react';
import { Button } from '../ui/button';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';
import { AVATAR_CATEGORIES, AvatarUseCase } from '@/constants/avatars';
import { cn } from '@/lib/utils';

// Helper function to get emoji for avatar based on category and name
const getAvatarEmoji = (avatar: AvatarUseCase): string => {
  if (avatar.category === 'Resort Services') {
    return '🏖️'; // Beach for resort services
  } else if (avatar.category === 'Dining & Experiences') {
    return '🍽️'; // Dining for culinary experiences
  } else if (avatar.category === 'Concierge') {
    if (avatar.name.toLowerCase().includes('tour')) {
      return '🗺️'; // Map for tour guides
    } else if (avatar.name.toLowerCase().includes('luxury')) {
      return '💎'; // Diamond for luxury services
    } else {
      return '🌺'; // Tropical flower for concierge
    }
  }
  return '🌴'; // Palm tree as default tropical emoji
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
  const [activeTab, setActiveTab] = useState<'concierge' | 'privacy'>('concierge');

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
    <div className="min-h-screen bg-gradient-to-br from-sandyBeige-50 via-caribbeanTurquoise-50 to-oceanBlue-100 flex items-center justify-center p-3 md:p-6 tropical-pattern">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-luxuryGold-200/30 overflow-hidden luxury-shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-oceanBlue-600 via-oceanBlue-700 to-caribbeanTurquoise-700 text-white p-6 md:p-8 relative overflow-hidden">
          {/* Tropical background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl">🌴</div>
            <div className="absolute top-8 right-8 text-4xl">🌺</div>
            <div className="absolute bottom-4 left-1/4 text-5xl">🏖️</div>
            <div className="absolute bottom-6 right-1/3 text-3xl">🐚</div>
          </div>
          
          <div className="relative z-10 text-center">            
            <div className="mb-4 flex items-center justify-center">
              
            </div>            
            <div className="mb-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-luxuryGold-200 to-sandyBeige-100 bg-clip-text text-transparent">
                Four Seasons Anguilla
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-luxuryGold-400 to-coralSunset-400 mx-auto rounded-full mb-3"></div>
              <h2 className="text-2xl md:text-3xl font-semibold text-caribbeanTurquoise-100">
                AI Concierge Experience
              </h2>
            </div>
            <p className="text-lg md:text-xl text-oceanBlue-100 font-medium max-w-2xl mx-auto">
              Welcome to paradise. Let our AI concierge guide you through the ultimate luxury Caribbean experience
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-r from-sandyBeige-50 to-caribbeanTurquoise-50 border-b border-oceanBlue-200">
          <div className="bg-gradient-to-r from-royalBlue-50 to-gold-50 border-b border-royalBlue-200 flex">
            {[
              { id: 'concierge', label: 'Choose Concierge', icon: '🌺' },
              { id: 'privacy', label: 'Privacy & Security', icon: '🔒' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'concierge' | 'privacy')}
                className={cn(
                  "flex items-center gap-2 py-4 px-6 border-b-2 transition-all duration-300",
                  activeTab === tab.id 
                    ? 'text-oceanBlue-700 border-luxuryGold-500 bg-white/70'
                    : 'text-gray-600 border-transparent hover:text-oceanBlue-600 hover:bg-white/50'
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
          {activeTab === 'concierge' && (
            <section className="mb-8" aria-labelledby="concierge-heading">
              <header className="text-center mb-6">
                <h2 
                  id="concierge-heading" 
                  className="font-bold text-2xl text-oceanBlue-900 bg-gradient-to-r from-oceanBlue-700 to-luxuryGold-600 bg-clip-text text-transparent"
                >
                  Select Your AI Concierge
                </h2>
                <p className="text-oceanBlue-600 mt-2 font-medium">
                  Choose your personal guide to Four Seasons Anguilla
                </p>
              </header>
              
              {/* Centered Concierge Selection */}
              <div className="flex justify-center mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {Object.values(AVATAR_CATEGORIES).flat().slice(0, 3).map((avatar) => (
                    <div
                      key={avatar.id}
                      onClick={() => onAvatarSelect(avatar)}
                      className={cn(
                        'flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 border-2 shadow-lg hover:shadow-xl text-center',
                        selectedAvatar.id === avatar.id
                          ? 'border-luxuryGold-400 bg-gradient-to-br from-luxuryGold-50 to-caribbeanTurquoise-50 shadow-luxuryGold-200'
                          : 'border-oceanBlue-200 bg-white hover:border-caribbeanTurquoise-300'
                      )}
                    >
                      <span className="text-5xl mb-3" aria-hidden="true">{getAvatarEmoji(avatar)}</span>
                      <span className="text-lg font-medium text-oceanBlue-800 mb-1">
                        {avatar.name}
                      </span>
                      <span className="text-sm text-oceanBlue-600">
                        {avatar.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Language Selection */}
              <div className="mt-8">
                <h3 className="text-center font-semibold text-xl text-oceanBlue-800 mb-4">
                  Select Your Language
                </h3>
                
                <div className="flex justify-center flex-wrap gap-4 max-w-2xl mx-auto">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => onLanguageSelect(lang.value)}
                      className={cn(
                        'flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105',
                        selectedLanguage === lang.value
                          ? 'border-luxuryGold-400 bg-gradient-to-br from-luxuryGold-50 to-white shadow-md'
                          : 'border-oceanBlue-200 bg-white hover:border-oceanBlue-300'
                      )}
                    >
                      <span className="text-3xl mb-1">{lang.flag}</span>
                      <span className="text-xs font-medium">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {activeTab === 'privacy' && (
            <section aria-labelledby="privacy-heading">
              <header className="text-center mb-6">
                <h2 
                  id="privacy-heading" 
                  className="font-bold text-2xl text-oceanBlue-900 bg-gradient-to-r from-oceanBlue-700 to-luxuryGold-600 bg-clip-text text-transparent"
                >
                  Camera Access & Privacy
                </h2>
              </header>
              
              <p className="text-oceanBlue-800 mb-6 leading-relaxed text-lg font-medium">
                To enable interactive features with our AI concierge, camera access is required. 
                Your privacy remains our highest priority at Four Seasons.
              </p>
              
              <ul className="space-y-4 mb-6" role="list">
                {privacyFeatures.map((feature, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-oceanBlue-200 shadow-sm hover:shadow-md transition-shadow duration-200" 
                    role="listitem"
                  >
                    <span className="text-2xl" aria-hidden="true">{feature.icon}</span>
                    <span className="text-oceanBlue-800 leading-relaxed font-medium">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-gradient-to-r from-luxuryGold-100 via-sandyBeige-50 to-caribbeanTurquoise-50 p-6 rounded-2xl border-2 border-luxuryGold-300 shadow-inner">
                <p className="text-oceanBlue-900 leading-relaxed font-medium">
                  Our AI concierge processes video feed in real time for responsive interaction, 
                  ensuring your experience is both seamless and secure.
                </p>
              </div>
            </section>
          )}

          {/* Begin Experience Button */}
          <div className="text-center mt-8">
            <Button
              onClick={() => onStart({ language: selectedLanguage, avatarUseCase: selectedAvatar })}
              size="lg"
              className="bg-gradient-to-r from-oceanBlue-600 to-caribbeanTurquoise-600 hover:from-oceanBlue-700 hover:to-caribbeanTurquoise-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-luxuryGold-300 text-lg ocean-shimmer coral-glow"
            >
              Begin Your Four Seasons Experience
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}