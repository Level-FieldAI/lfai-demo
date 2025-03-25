import { useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/constants/languages';
import { AVATAR_USE_CASES, DEFAULT_AVATAR, AvatarUseCase } from '@/constants/avatars';

interface WelcomeScreenProps {
  onStart: (options: { language: string; avatarUseCase: AvatarUseCase }) => void;
  loading: boolean;
}

export const WelcomeScreen = ({ onStart, loading }: WelcomeScreenProps) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE.value);
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR.id);

  const handleStart = () => {
    const avatarUseCase = AVATAR_USE_CASES.find(avatar => avatar.id === selectedAvatar) || DEFAULT_AVATAR;
    onStart({ language, avatarUseCase });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-3 md:gap-5 p-3 md:p-6 overflow-y-auto py-4'>
      <img src="/logo.png" alt="WhitegloveAI Logo" className="w-36 md:w-48 mb-1 md:mb-2" />
      
      <h1 className='text-2xl md:text-4xl text-center font-bold'>
        The Future of AI Interaction Starts Now
      </h1>
      <h2 className='text-lg md:text-xl text-center text-gray-700'>Dive Into an Engaging, Intelligent, and Fun Experience</h2>
      
      <div className="w-full max-w-xs mt-1">
        <label htmlFor="avatar-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Virtual Assistant
        </label>
        <Select value={selectedAvatar} onValueChange={setSelectedAvatar}>
          <SelectTrigger id="avatar-select" className="w-full mb-3">
            <SelectValue placeholder="Select an avatar" />
          </SelectTrigger>
          <SelectContent>
            {AVATAR_USE_CASES.map((avatar) => (
              <SelectItem key={avatar.id} value={avatar.id}>
                {avatar.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
      
      <div className="w-full max-w-md bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
        <h3 className="font-semibold text-base mb-1">We'll need to use your camera, but don't worry—we take your privacy seriously.</h3>
        <p className="text-sm text-gray-700 mb-2">
          When you enable your camera, our AI avatar can see what you see and respond in real-time.
          It's what makes this experience so unique! But we understand you might have questions about privacy, so here's what you should know:
        </p>
        <ul className="text-sm text-gray-700 mb-2 space-y-0.5">
          <li className="flex items-start">
            <span className="text-green-500 mr-1">✓</span> Nothing gets recorded or saved — ever. The video feed isn't stored anywhere.
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-1">✓</span> Everything happens right on your device. Your camera feed never leaves your computer or phone.
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-1">✓</span> Your data stays yours. We've built this with privacy as our #1 priority.
          </li>
        </ul>
        <p className="text-sm text-gray-700 mb-1">
          Think of it like a video call where the other person can see you only during the call, but doesn't take screenshots or record anything.
        </p>
        <p className="text-sm text-gray-700">
          Ready to see what our AI avatar can do? Just click "Allow" when prompted, and you can always disable camera access at any time.
        </p>
      </div>
      
      <Button className="mt-2 px-6 py-2 text-lg" onClick={handleStart}>
        {loading ? 'Loading...' : 'Start Conversation'}
      </Button>
    </div>
  );
};
