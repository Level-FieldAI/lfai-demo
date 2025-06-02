import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppWithConversations from '@/components/AppWithConversations'
import { Toaster } from "@/components/ui/toaster"
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithConversations />
    <Toaster />
  </StrictMode>,
)
