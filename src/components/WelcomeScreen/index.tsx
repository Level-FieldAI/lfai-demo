// src/components/WelcomeScreen.tsx
import React, { useState } from 'react';
import { Button } from '../ui/button'; // Keep existing import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'; // Keep existing import
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/constants/languages'; // Keep existing import
import { AVATAR_USE_CASES, DEFAULT_AVATAR, AvatarUseCase } from '@/constants/avatars'; // Keep existing import
import { cn } from '@/lib/utils'; // Assuming cn utility is available

interface WelcomeScreenProps {
  onStart: (options: { language: string; avatarUseCase: AvatarUseCase }) => void;
  loading: boolean;
}

export const WelcomeScreen = ({ onStart, loading }: WelcomeScreenProps) => {
  // State for selected language, initialized with default
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE.value);
  // State for the selected avatar object, initialized with the default avatar object
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarUseCase>(DEFAULT_AVATAR);

  // Handler for starting the conversation
  const handleStart = () => {
    // Pass the selected language and the full selected avatar object
    onStart({ language, avatarUseCase: selectedAvatar });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-3 md:gap-5 p-4 sm:p-6 overflow-y-auto py-8'>
      {/* Logo */}
      <img
        src="/logo.png"
        alt="WhitegloveAI Logo"
        className="w-36 md:w-48 mb-2 md:mb-4 object-contain"
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x64/cccccc/ffffff?text=Logo')} // Fallback
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
            {/* Map through the available avatars to create clickable cards */}
            {AVATAR_USE_CASES.map((avatar) => (
              <div
                key={avatar.id}
                className={cn(
                  'border rounded-lg p-3 text-center cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105 flex flex-col items-center justify-center aspect-square', // Added aspect-square for consistency
                  selectedAvatar.id === avatar.id
                    ? 'border-indigo-500 ring-2 ring-indigo-300 bg-indigo-50' // Style for selected avatar
                    : 'border-gray-300 bg-white' // Style for non-selected avatars
                )}
                onClick={() => setSelectedAvatar(avatar)} // Set the selected avatar object on click
                role="button"
                aria-pressed={selectedAvatar.id === avatar.id}
                tabIndex={0} // Make it focusable
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedAvatar(avatar); }} // Keyboard selection
              >
                
                <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{avatar.name}</p>
                 {/* Optionally add description back for larger screens if desired */}
                 {/* <p className="text-xs text-gray-500 mt-1 hidden md:block">{avatar.description}</p> */}
              </div>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="w-full max-w-xs mx-auto">
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
            Conversation Language
          </label>
          {/* Using the Select components from your ui library */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language-select" className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={`${lang.value}-${lang.label}`} value={lang.value}>
                  {lang.flag} {lang.label} {/* Display flag and label */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Privacy Notice */}
        <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg border border-gray-200 mx-auto">
           {/* Content remains the same as your original code */}
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
          {/* Using the Button component from your ui library */}
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
