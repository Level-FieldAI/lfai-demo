import { useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/constants/languages';

export const WelcomeScreen = ({ onStart, loading }: { onStart: (language: string) => void, loading: boolean }) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE.value);

  const handleStart = () => {
    onStart(language);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-6 md:gap-10 p-4 md:p-10 overflow-y-auto py-8'>
      <img src="/logo.png" alt="WhitegloveAI Logo" className="w-36 md:w-48 mb-2 md:mb-4" />
      
      <h1 className='text-2xl md:text-4xl text-center font-bold'>
        The Future of AI Interaction Starts Now
      </h1>
      <h2 className='text-lg md:text-xl text-center text-gray-700'>Dive Into an Engaging, Intelligent, and Fun Experience</h2>
      
      <div className="w-full max-w-xs">
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
      
      <Button className="mt-4 px-6 py-2 text-lg" onClick={handleStart}>
        {loading ? 'Loading...' : 'Start Conversation'}
      </Button>
    </div>
  );
};
