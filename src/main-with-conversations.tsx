import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWithConversations from '@/components/AppWithConversations'
import { Toaster } from '@/components/ui/toaster'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithConversations />
    <Toaster />
  </React.StrictMode>,
)