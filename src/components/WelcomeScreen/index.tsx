import { Button } from '../ui/button';

export const WelcomeScreen = ({ onStart, loading }: { onStart: () => void, loading: boolean }) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-6 md:gap-10 p-4 md:p-10 overflow-y-auto py-8'>
      <img src="/logo.png" alt="WhitegloveAI Logo" className="w-36 md:w-48 mb-2 md:mb-4" />
      
      <h1 className='text-2xl md:text-4xl text-center font-bold'>
        The Future of AI Interaction Starts Now
      </h1>
      <h2 className='text-lg md:text-xl text-center text-gray-700'>Dive Into an Engaging, Intelligent, and Fun Experience</h2>
      <Button className="mt-2 px-6 py-2 text-lg" onClick={onStart}>
        {loading ? 'Loading...' : 'Start Conversation'}
      </Button>
    </div>
  );
};
