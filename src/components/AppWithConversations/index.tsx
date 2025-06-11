import { useEffect, useState } from 'react'
import { DailyProvider } from '@daily-co/daily-react'
import WelcomeScreen from '@/components/WelcomeScreen'
import { HairCheckScreen } from '@/components/HairCheckScreen'
import { CallScreen } from '@/components/CallScreen'
import { SessionManager } from '@/components/SessionManager'
import { createConversation, endConversation } from '@/api'
import { IConversation } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils'
import { AvatarUseCase, DEFAULT_AVATAR } from '@/constants/avatars'
import { DEFAULT_LANGUAGE } from '@/constants/languages'

// Import test utility for development
import '@/utils/testUsageTracker'

type Screen = 'welcome' | 'hairCheck' | 'call'

function AppWithConversations() {
  const { toast } = useToast()
  const [screen, setScreen] = useState<Screen>('welcome')
  const [conversation, setConversation] = useState<IConversation | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState<AvatarUseCase>(DEFAULT_AVATAR)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE.value)

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
      
      console.log('Starting conversation with avatar:', avatarUseCase.name);
      const conversationData = await createConversation({ language, avatarUseCase });
      
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

  const renderHeader = () => (
    <header className={cn("flex justify-between items-center", {
      "py-2 px-4": isMobile,
      "py-1 px-6": !isMobile,
    })}>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Level-FieldAI Demo</h1>
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className={cn("text-center text-gray-600 text-xs sm:text-sm border-t bg-white", {
      "py-2": isMobile,
      "py-1": !isMobile,
    })}>
      <div className="flex justify-center items-center px-4">
        <p>Level-FieldAI Demo</p>
      </div>
    </footer>
  );

  return (
    <SessionManager
      onStartNewCall={() => setScreen('welcome')}
      showTimer={true}
      onSessionStart={() => {
        console.log('Session started');
      }}
      onSessionEnd={(reason, duration) => {
        console.log('Session ended:', reason, 'Duration:', duration);
        if (screen === 'call') {
          handleEnd();
        }
      }}
      onUsageLimitReached={(type) => {
        if (type === 'daily-limit') {
          toast({
            title: 'Daily Limit Reached',
            description: 'You have reached your daily limit of 3 avatar calls.',
            variant: 'destructive',
          });
        }
      }}
      autoEndOnTimeLimit={true}
    >
      <main className="flex flex-col min-h-screen">
        <DailyProvider>
          {screen === 'welcome' && (
            <>
              {renderHeader()}
              <div className="flex-grow">
                <WelcomeScreen 
                  selectedAvatar={currentAvatar}
                  onAvatarSelect={setCurrentAvatar}
                  selectedLanguage={selectedLanguage}
                  onLanguageSelect={setSelectedLanguage}
                  onStart={handleStart}
                />
              </div>
              {renderFooter()}
            </>
          )}
          
          {screen === 'hairCheck' && (
            <div className="flex flex-col h-screen">
              {renderHeader()}
              
              <div className="flex-grow">
                <HairCheckScreen handleEnd={handleEnd} handleJoin={handleJoin} isMobile={isMobile} />
              </div>
              
              <div className="bg-gray-50 p-2 border-t border-gray-200">
                <p className="text-center text-sm font-medium">{currentAvatar.name}</p>
                <p className="text-center text-xs text-gray-600">{currentAvatar.description}</p>
              </div>
              
              {renderFooter()}
            </div>
          )}
          
          {screen === 'call' && conversation && (
            <div className={cn("flex flex-col h-screen", {
              "mobile-call-layout": isMobile,
            })}>
              {renderHeader()}
              
              <div className={cn("flex-grow w-full overflow-hidden", {
                "min-h-0": isMobile, // Ensures flex child can shrink below content size
              })}>
                <CallScreen conversation={conversation} handleEnd={handleEnd} isMobile={isMobile} />
              </div>
              
              <div className={cn("bg-gray-50 border-t border-gray-200 flex-shrink-0", {
                "py-1 px-2": isMobile,
                "py-0.5 px-4": !isMobile,
              })}>
                <div className={cn("flex justify-between items-center", {
                  "text-xs": isMobile,
                  "text-sm": !isMobile,
                })}>
                  <p className="font-medium truncate max-w-[50%]">{currentAvatar.name}</p>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 hidden sm:inline">Status:</span>
                    <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              
              {!isMobile && renderFooter()}
            </div>
          )}
        </DailyProvider>
      </main>
    </SessionManager>
  )
}

export default AppWithConversations