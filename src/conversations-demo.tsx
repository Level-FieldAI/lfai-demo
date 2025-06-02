import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConversationsDemo } from '@/components/ConversationsDemo'
import { Toaster } from '@/components/ui/toaster'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConversationsDemo />
    <Toaster />
  </React.StrictMode>,
)