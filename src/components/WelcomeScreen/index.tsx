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
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-luxuryGold-300/40 overflow-hidden luxury-shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-oceanBlue-800 via-oceanBlue-700 to-caribbeanTurquoise-800 text-white p-8 md:p-10 relative overflow-hidden">
          {/* Luxury background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('/patterns/luxury-pattern.svg')] bg-repeat bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          
          <div className="relative z-10 text-center">            
            <div className="mb-6 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-luxuryGold-400 via-luxuryGold-300 to-luxuryGold-400 rounded-full opacity-75 blur-sm animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-luxuryGold-600 to-luxuryGold-400 text-white text-xl font-serif italic px-6 py-1 rounded-full border border-luxuryGold-200 shadow-lg">
                  Four Seasons
                </div>
              </div>
            </div>            
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-luxuryGold-200 to-sandyBeige-100 bg-clip-text text-transparent font-serif tracking-wide">
                Anguilla
              </h1>
              <div className="w-32 h-0.5 bg-gradient-to-r from-luxuryGold-400 to-coralSunset-400 mx-auto rounded-full mb-4"></div>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wider">
                LUXURY AI CONCIERGE
              </h2>
            </div>
            <p className="text-lg md:text-xl text-oceanBlue-50 font-light max-w-2xl mx-auto leading-relaxed">
              Discover the epitome of Caribbean luxury with our personalized AI concierge service, designed to elevate your Four Seasons experience to new heights.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-r from-sandyBeige-50 to-caribbeanTurquoise-50 border-b border-oceanBlue-200">
          <div className="flex">
            {[
              { id: 'concierge', label: 'Select Experience', icon: '🌺' },
              { id: 'privacy', label: 'Privacy & Security', icon: '🔒' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'concierge' | 'privacy')}
                className={cn(
                  "flex items-center gap-2 py-5 px-8 border-b-2 transition-all duration-300 font-medium",
                  activeTab === tab.id 
                    ? 'text-oceanBlue-800 border-luxuryGold-500 bg-white/70'
                    : 'text-oceanBlue-600 border-transparent hover:text-oceanBlue-700 hover:bg-white/50'
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8 md:p-10 bg-gradient-to-b from-white to-sandyBeige-50">
          {activeTab === 'concierge' && (
            <section className="mb-8" aria-labelledby="concierge-heading">
              <header className="text-center mb-8">
                <h2 
                  id="concierge-heading" 
                  className="font-serif font-bold text-2xl md:text-3xl text-oceanBlue-900 bg-gradient-to-r from-oceanBlue-800 to-luxuryGold-600 bg-clip-text text-transparent tracking-wide"
                >
                  Your Personal Concierge
                </h2>
                <p className="text-oceanBlue-700 mt-3 font-light text-lg max-w-2xl mx-auto">
                  Select your personal guide to enhance your Four Seasons Anguilla experience
                </p>
                <div className="w-16 h-0.5 bg-luxuryGold-400 mx-auto mt-4"></div>
              </header>
              
              {/* Centered Concierge Selection */}
              <div className="flex justify-center mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                  {Object.values(AVATAR_CATEGORIES).flat().slice(0, 3).map((avatar) => (
                    <div
                      key={avatar.id}
                      onClick={() => onAvatarSelect(avatar)}
                      className={cn(
                        'flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-105 border shadow-xl hover:shadow-2xl text-center',
                        selectedAvatar.id === avatar.id
                          ? 'border-luxuryGold-400 bg-gradient-to-br from-luxuryGold-50 to-caribbeanTurquoise-50 shadow-luxuryGold-200/50'
                          : 'border-oceanBlue-100 bg-white hover:border-caribbeanTurquoise-300'
                      )}
                    >
                      <span className="text-6xl mb-4" aria-hidden="true">{getAvatarEmoji(avatar)}</span>
                      <span className="text-xl font-medium text-oceanBlue-800 mb-2 font-serif">
                        {avatar.name}
                      </span>
                      <span className="text-sm text-oceanBlue-600 font-light tracking-wide">
                        {avatar.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Language Selection */}
              <div className="mt-10">
                <h3 className="text-center font-serif font-medium text-xl text-oceanBlue-800 mb-6">
                  Select Your Preferred Language
                </h3>
                <div className="w-12 h-0.5 bg-luxuryGold-300 mx-auto mb-6"></div>
                
                <div className="flex justify-center flex-wrap gap-5 max-w-2xl mx-auto">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => onLanguageSelect(lang.value)}
                      className={cn(
                        'flex flex-col items-center p-4 rounded-xl border transition-all duration-300 hover:scale-105',
                        selectedLanguage === lang.value
                          ? 'border-luxuryGold-400 bg-gradient-to-br from-luxuryGold-50 to-white shadow-md'
                          : 'border-oceanBlue-100 bg-white hover:border-oceanBlue-300'
                      )}
                    >
                      <span className="text-3xl mb-2">{lang.flag}</span>
                      <span className="text-sm font-medium tracking-wide">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {activeTab === 'privacy' && (
            <section aria-labelledby="privacy-heading">
              <header className="text-center mb-8">
                <h2 
                  id="privacy-heading" 
                  className="font-serif font-bold text-2xl md:text-3xl text-oceanBlue-900 bg-gradient-to-r from-oceanBlue-800 to-luxuryGold-600 bg-clip-text text-transparent tracking-wide"
                >
                  Privacy & Security
                </h2>
                <p className="text-oceanBlue-700 mt-3 font-light text-lg max-w-2xl mx-auto">
                  Your privacy is our utmost priority at Four Seasons
                </p>
                <div className="w-16 h-0.5 bg-luxuryGold-400 mx-auto mt-4"></div>
              </header>
              
              <p className="text-oceanBlue-800 mb-8 leading-relaxed text-lg font-light text-center max-w-3xl mx-auto">
                To enable interactive features with our AI concierge, camera access is required. 
                Rest assured that your privacy and security are paramount to the Four Seasons experience.
              </p>
              
              <ul className="space-y-5 mb-8 max-w-3xl mx-auto" role="list">
                {privacyFeatures.map((feature, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-5 bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-oceanBlue-100 shadow-md hover:shadow-lg transition-shadow duration-300" 
                    role="listitem"
                  >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-oceanBlue-100 to-caribbeanTurquoise-100 rounded-full border border-oceanBlue-200">
                      <span className="text-2xl" aria-hidden="true">{feature.icon}</span>
                    </div>
                    <span className="text-oceanBlue-800 leading-relaxed font-light text-lg pt-1">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-gradient-to-r from-luxuryGold-100 via-sandyBeige-50 to-caribbeanTurquoise-50 p-8 rounded-2xl border border-luxuryGold-200 shadow-inner max-w-3xl mx-auto">
                <p className="text-oceanBlue-900 leading-relaxed font-light text-center text-lg">
                  Our AI concierge processes video feed in real time for responsive interaction, 
                  ensuring your experience is both seamless and secure. At Four Seasons, we believe 
                  luxury and privacy go hand in hand.
                </p>
              </div>
            </section>
          )}

          {/* Begin Experience Button */}
          <div className="text-center mt-12">
            <div className="inline-block relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-luxuryGold-400 via-caribbeanTurquoise-400 to-luxuryGold-400 rounded-2xl opacity-70 blur-sm animate-pulse"></div>
              <Button
                onClick={() => onStart({ language: selectedLanguage, avatarUseCase: selectedAvatar })}
                size="lg"
                className="relative bg-gradient-to-r from-oceanBlue-700 to-caribbeanTurquoise-700 hover:from-oceanBlue-800 hover:to-caribbeanTurquoise-800 text-white font-medium py-6 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 border border-luxuryGold-300 text-lg tracking-wide"
              >
                Begin Your Luxury Experience
              </Button>
            </div>
            <p className="text-oceanBlue-600 text-sm mt-4 font-light italic">
              Personalized excellence awaits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}