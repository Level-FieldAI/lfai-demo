import { useEffect, useState } from 'react'
import { DailyProvider } from '@daily-co/daily-react'
import WelcomeScreen from '@/components/WelcomeScreen'
import { HairCheckScreen } from '@/components/HairCheckScreen'
import { CallScreen } from '@/components/CallScreen'
import { ConversationsPage } from '@/components/ConversationsPage'
import { createConversation, endConversation } from '@/api'
import { IConversation } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { useConversationMonitor } from '@/hooks/useConversationMonitor'
import { cn } from '@/lib/utils'
import { AvatarUseCase, DEFAULT_AVATAR } from '@/constants/avatars'
import { DEFAULT_LANGUAGE } from '@/constants/languages'
import { Button } from '@/components/ui/button'

type Screen = 'welcome' | 'hairCheck' | 'call' | 'conversations'

function AppWithConversations() {
  const { toast } = useToast()
  const [screen, setScreen] = useState<Screen>('welcome')
  const [conversation, setConversation] = useState<IConversation | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState<AvatarUseCase>(DEFAULT_AVATAR)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE.value)
  const [completedConversations, setCompletedConversations] = useState<IConversation[]>([])

  // Monitor current conversation
  const { isCompleted, hasError } = useConversationMonitor({
    conversationId: conversation?.conversation_id,
    onConversationComplete: (completedConversation) => {
      toast({
        title: 'Call Completed',
        description: `Your conversation with ${currentAvatar.name} has ended.`,
      });
      
      setCompletedConversations(prev => {
        const exists = prev.some(c => c.conversation_id === completedConversation.conversation_id);
        if (!exists) {
          return [completedConversation, ...prev];
        }
        return prev.map(c => 
          c.conversation_id === completedConversation.conversation_id ? completedConversation : c
        );
      });
    },
    onConversationError: () => {
      toast({
        title: 'Call Error',
        description: `Your conversation with ${currentAvatar.name} encountered an error.`,
        variant: 'destructive',
      });
    },
    enabled: !!conversation && screen === 'call',
  });

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

  const handleViewConversations = () => {
    setScreen('conversations')
  }

  const handleBackFromConversations = () => {
    setScreen('welcome')
  }

  const renderHeader = () => (
    <header className={cn("flex justify-between items-center", {
      "py-2 px-4": isMobile,
      "py-1 px-6": !isMobile,
    })}>
      
      
      <div className="flex items-center gap-2">
        {completedConversations.length > 0 && screen !== 'conversations' && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {completedConversations.length} completed
          </span>
        )}
        
        {screen === 'conversations' && (
          <Button 
            onClick={handleBackFromConversations} 
            variant="outline" 
            size="sm"
          >
            Back to Call
          </Button>
        )}
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className={cn("text-center text-gray-600 text-xs sm:text-sm border-t bg-white", {
      "py-2": isMobile,
      "py-1": !isMobile,
    })}>
      <div className="flex justify-between items-center px-4">
        <p>Level-FieldAI Demo</p>
        
        {screen !== 'conversations' && (
          <Button 
            onClick={handleViewConversations} 
            variant="outline" 
            size="sm"
            className="ml-4"
          >
            Conversations
          </Button>
        )}
      </div>
    </footer>
  );

  return (
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
          <div className="flex flex-col h-screen">
            {renderHeader()}
            
            <div className="flex-grow w-full">
              <CallScreen conversation={conversation} handleEnd={handleEnd} isMobile={isMobile} />
            </div>
            
            <div className={cn("bg-gray-50 border-t border-gray-200", {
              "py-1": isMobile,
              "py-0.5": !isMobile,
            })}>
              <div className="flex justify-between items-center px-4">
                <p className="text-xs font-medium">{currentAvatar.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    isCompleted ? 'bg-blue-100 text-blue-800' :
                    hasError ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {isCompleted ? 'Completed' : hasError ? 'Error' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
            
            {renderFooter()}
          </div>
        )}

        {screen === 'conversations' && (
          <div className="flex flex-col h-screen">
            {renderHeader()}
            
            <div className="flex-grow overflow-hidden">
              <ConversationsPage 
                autoRefresh={true}
                refreshInterval={5000}
                onConversationSelect={(selectedConversation) => {
                  console.log('Selected conversation:', selectedConversation);
                  toast({
                    title: 'Conversation Selected',
                    description: `Viewing details for conversation ${selectedConversation.conversation_name || selectedConversation.conversation_id}`,
                  });
                }}
              />
            </div>
            
            {renderFooter()}
          </div>
        )}

        {/* Floating notification for completed calls */}
        {completedConversations.length > 0 && screen !== 'conversations' && (
          <div className="fixed bottom-4 right-4 max-w-sm z-50">
            <div className="bg-white rounded-lg shadow-lg border p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">Recent Completed Calls</h3>
                <Button
                  onClick={() => setCompletedConversations([])}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {completedConversations.slice(0, 3).map((conv) => (
                  <div key={conv.conversation_id} className="text-sm">
                    <div className="font-medium text-gray-800 truncate">
                      Call with {currentAvatar.name}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {new Date(conv.ended_at || conv.updated_at || conv.created_at).toLocaleTimeString()}
                    </div>
                                   </div>
                ))}
              </div>
              
              {completedConversations.length > 3 && (
                <div className="text-xs text-gray-500 mt-2">
                  +{completedConversations.length - 3} more
                </div>
              )}
              
              <Button 
                onClick={handleViewConversations} 
                size="sm" 
                className="w-full mt-2"
              >
                View All Conversations
              </Button>
            </div>
          </div>
        )}
      </DailyProvider>
    </main>
  )
}

export default AppWithConversations