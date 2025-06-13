import { useEffect, useState } from 'react'
import { DailyProvider } from '@daily-co/daily-react'
import WelcomeScreen from '@/components/WelcomeScreen'
import { HairCheckScreen } from '@/components/HairCheckScreen'
import { CallScreen } from '@/components/CallScreen'
import CVIDemo from '@/components/CVIDemo'
import { createConversation, endConversation } from '@/api'
import { IConversation } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils'
import { AvatarUseCase, DEFAULT_AVATAR } from '@/constants/avatars'
import { DEFAULT_LANGUAGE } from '@/constants/languages'

function App() {
  const { toast } = useToast()
  const [screen, setScreen] = useState<'welcome' | 'hairCheck' | 'call' | 'cvi'>('welcome')
  const [conversation, setConversation] = useState<IConversation | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState<AvatarUseCase>(DEFAULT_AVATAR)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE.value)

  // Check URL for CVI demo mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'cvi') {
      setScreen('cvi');
    }
  }, []);

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

  const handleStart = async ({ language, avatarUseCase }: { language: string; avatarUseCase: AvatarUseCase }) => {
    try {


      setCurrentAvatar(avatarUseCase)
      
      let conversationData;
      
      // We've made the createConversation function compatible with both implementations
      console.log('Starting conversation with avatar:', avatarUseCase.name);
      conversationData = await createConversation({ language, avatarUseCase });
      
      setConversation(conversationData)
      setScreen('hairCheck')
    } catch (error) {
      console.error("App error starting conversation:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: `Could not create conversation: ${errorMessage}`,
      })


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

  const handleCVIDemo = () => {
    setScreen('cvi')
  }

  const handleBackToWelcome = () => {
    setScreen('welcome')
  }

  return (
    <main className="flex flex-col min-h-screen">
      <DailyProvider>
        {screen === 'welcome' && (
          <WelcomeScreen 
            selectedAvatar={currentAvatar}
            onAvatarSelect={setCurrentAvatar}
            selectedLanguage={selectedLanguage}
            onLanguageSelect={setSelectedLanguage}
            onStart={handleStart}
            onCVIDemo={handleCVIDemo}
          />
        )}
        
        {screen === 'hairCheck' && (
          <div className="flex flex-col h-screen">
            
            
            {/* Main content area */}
            <div className="flex-grow">
              <HairCheckScreen handleEnd={handleEnd} handleJoin={handleJoin} isMobile={isMobile} />
            </div>
            
            {/* Avatar info */}
            <div className="bg-gray-50 p-2 border-t border-gray-200">
              <p className="text-center text-sm font-medium">{currentAvatar.name}</p>
              <p className="text-center text-xs text-gray-600">{currentAvatar.description}</p>
            </div>
            
            {/* Minimal footer */}
            <footer className="py-2 text-center text-gray-600 text-xs sm:text-sm">
              <p>Level-FieldAI Demo</p>
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
              
            </header>
            
            {/* Main content area - maximized for video */}
            <div className="flex-grow w-full">
              <CallScreen conversation={conversation} handleEnd={handleEnd} isMobile={isMobile} />
            </div>
            
            {/* Avatar info - very compact */}
            <div className={cn("bg-gray-50 border-t border-gray-200", {
              "py-1": isMobile,
              "py-0.5": !isMobile,
            })}>
              <p className="text-center text-xs font-medium">{currentAvatar.name}</p>
            </div>
            
            {/* Minimal footer */}
            <footer className={cn("text-center text-gray-600 text-xs sm:text-sm", {
              "py-1": isMobile,
              "py-0.5": !isMobile, // Even more compact on desktop
            })}>
              <p>Level-FieldAI Demo</p>
            </footer>
          </div>
        )}
        {screen === 'cvi' && (
          <div className="flex flex-col h-screen">
            {/* Header with back button */}
            <header className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackToWelcome}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  ← Back to Main Demo
                </button>
                <h1 className="text-xl font-semibold">Tavus CVI Demo</h1>
                <div></div> {/* Spacer for centering */}
              </div>
            </header>

            {/* CVI Demo */}
            <div className="flex-grow">
              <CVIDemo />
            </div>
          </div>
        )}      </DailyProvider>
    </main>
  )
}

export default App
