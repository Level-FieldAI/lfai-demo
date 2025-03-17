import { Button } from '../ui/button';

export const WelcomeScreen = ({ onStart, loading }: { onStart: () => void, loading: boolean }) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-10 p-10'>
      <img src="/logo.png" alt="WhitegloveAI Logo" className="w-48 mb-4" />
      <h1 className='text-4xl'>
        The Future of AI Interaction Starts Now
      </h1>
      <h2 className='text-xl'>Dive Into an Engaging, Intelligent, and Fun Experience</h2>
      <Button onClick={onStart}>{loading ? 'Loading...' : 'Start Conversation'}</Button>
    </div>
  );
};
