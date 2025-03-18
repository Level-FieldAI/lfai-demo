import { useEffect, useState } from 'react'
import { DailyProvider } from '@daily-co/daily-react'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { HairCheckScreen } from '@/components/HairCheckScreen'
import { CallScreen } from '@/components/CallScreen'
import { createConversation, endConversation } from '@/api'
import { IConversation } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils'

function App() {
  const { toast } = useToast()
  const [screen, setScreen] = useState<'welcome' | 'hairCheck' | 'call'>('welcome')
  const [conversation, setConversation] = useState<IConversation | null>(null)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (conversation) {
        void endConversation(conversation.conversation_id)
      }
    }
  }, [conversation])

  const handleStart = async (language: string) => {
    try {
      setLoading(true)
      const conversation = await createConversation(language)
      setConversation(conversation)
      setScreen('hairCheck')
    } catch {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: 'Check console for details',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnd = async () => {
    try {
      if (!conversation) return
      await endConversation(conversation.conversation_id)
    } catch (error) {
      console.error(error)
    } finally {
      setConversation(null)
      setScreen('welcome')
    }
  }

  const handleJoin = () => {
    setScreen('call')
  }

  return (
    <main className="flex flex-col min-h-screen">
      <DailyProvider>
        {screen === 'welcome' && <WelcomeScreen onStart={handleStart} loading={loading} />}
        
        {screen === 'hairCheck' && (
          <div className="flex flex-col h-screen">
            {/* Compact header */}
            <header className="flex justify-center items-center py-2">
              <img
                src="/logo.png"
                alt="WhitegloveAI Logo"
                className="h-8 sm:h-10 object-contain"
              />
            </header>
            
            {/* Main content area */}
            <div className="flex-grow">
              <HairCheckScreen handleEnd={handleEnd} handleJoin={handleJoin} isMobile={isMobile} />
            </div>
            
            {/* Minimal footer */}
            <footer className="py-2 text-center text-gray-600 text-xs sm:text-sm">
              <p>WGAI Lab Demo</p>
            </footer>
          </div>
        )}
        
        {screen === 'call' && conversation && (
          <div className="flex flex-col h-screen">
            {/* Compact header */}
            <header className={cn("flex justify-center items-center", {
              "py-2": isMobile,
              "py-1": !isMobile, // Even more compact on desktop to maximize video space
            })}>
              <img
                src="/logo.png"
                alt="WhitegloveAI Logo"
                className="h-8 sm:h-10 object-contain"
              />
            </header>
            
            {/* Main content area - maximized for video */}
            <div className="flex-grow w-full">
              <CallScreen conversation={conversation} handleEnd={handleEnd} isMobile={isMobile} />
            </div>
            
            {/* Minimal footer */}
            <footer className={cn("text-center text-gray-600 text-xs sm:text-sm", {
              "py-2": isMobile,
              "py-1": !isMobile, // Even more compact on desktop
            })}>
              <p>WGAI Lab Demo</p>
            </footer>
          </div>
        )}
      </DailyProvider>
    </main>
  )
}

export default App
