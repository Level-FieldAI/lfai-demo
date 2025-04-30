// src/components/WelcomeScreen.tsx
import { useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/constants/languages';
import { AVATAR_USE_CASES, DEFAULT_AVATAR, AvatarUseCase } from '@/constants/avatars';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onStart: (options: { language: string; avatarUseCase: AvatarUseCase }) => void;
  loading: boolean;
}

export const WelcomeScreen = ({ onStart, loading }: WelcomeScreenProps) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE.value);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarUseCase>(DEFAULT_AVATAR);

  const handleStart = () => {
    onStart({ language, avatarUseCase: selectedAvatar });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-3 md:gap-5 p-4 sm:p-6 overflow-y-auto py-8'>
      {/* Logo */}
      <img
        src="/logo.png"
        alt="WhitegloveAI Logo"
        className="w-36 md:w-48 mb-2 md:mb-4 object-contain"
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x64/cccccc/ffffff?text=Logo')}
      />

      {/* Headings */}
      <h1 className='text-2xl md:text-4xl text-center font-bold text-gray-800'>
        The Future of AI Interaction Starts Now
      </h1>
      <h2 className='text-lg md:text-xl text-center text-gray-600 mb-4 md:mb-6'>
        Dive Into an Engaging, Intelligent, and Fun Experience
      </h2>

      {/* Main Content Area */}
      <div className="w-full max-w-3xl space-y-6 md:space-y-8">

        {/* Avatar Selection Grid */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-3 text-center">
            Select Virtual Assistant
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {AVATAR_USE_CASES.map((avatar) => (
              <div
                key={avatar.id}
                className={cn(
                  'border rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105 flex flex-col items-center justify-center aspect-square',
                  selectedAvatar.id === avatar.id
                    ? 'border-indigo-500 ring-2 ring-indigo-300 bg-indigo-50'
                    : 'border-gray-300 bg-white'
                )}
                onClick={() => setSelectedAvatar(avatar)}
                role="button"
                aria-pressed={selectedAvatar.id === avatar.id}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedAvatar(avatar);
                }}
              >
                <span className="text-base font-semibold text-gray-800">{avatar.name}</span>
                {/* Optionally, show description below name */}
                {/* <span className="text-xs text-gray-500 mt-1">{avatar.description}</span> */}
              </div>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="w-full max-w-xs mx-auto">
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
            Conversation Language
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language-select" className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={`${lang.value}-${lang.label}`} value={lang.value}>
                  {lang.flag} {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Privacy Notice */}
        <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg border border-gray-200 mx-auto">
          <h3 className="font-semibold text-base mb-1">We'll need to use your camera, but don't worry—we take your privacy seriously.</h3>
          <p className="text-sm text-gray-700 mb-2">
            When you enable your camera, our AI avatar can see what you see and respond in real-time.
            It's what makes this experience so unique! But we understand you might have questions about privacy, so here's what you should know:
          </p>
          <ul className="text-sm text-gray-700 mb-2 space-y-0.5">
            <li className="flex items-start">
              <span className="text-green-500 mr-1.5 mt-0.5">✓</span> Nothing gets recorded or saved — ever. The video feed isn't stored anywhere.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-1.5 mt-0.5">✓</span> Everything happens right on your device. Your camera feed never leaves your computer or phone.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-1.5 mt-0.5">✓</span> Your data stays yours. We've built this with privacy as our #1 priority.
            </li>
          </ul>
          <p className="text-sm text-gray-700 mb-1">
            Think of it like a video call where the other person can see you only during the call, but doesn't take screenshots or record anything.
          </p>
          <p className="text-sm text-gray-700">
            Ready to see what our AI avatar can do? Just click "Allow" when prompted, and you can always disable camera access at any time.
          </p>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button className="mt-2 px-8 py-3 text-lg" onClick={handleStart} disabled={loading}>
            {loading ? 'Loading...' : 'Start Conversation'}
          </Button>
        </div>
      </div>

      {/* Optional Footer */}
      <footer className="mt-8 text-center text-gray-500 text-xs sm:text-sm">
        <p>WGAI Lab Demo</p>
      </footer>
    </div>
  );
};