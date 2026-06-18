import { ChatPanel } from '../components/chat/ChatPanel'
import { MessageCircle } from 'lucide-react'

export const ChatPage = () => {
  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <MessageCircle size={28} className="text-muted" />
          Global Assistant
        </h1>
        <p className="text-muted">Ask questions about garbage classification results across all your historical jobs.</p>
      </div>

      <ChatPanel />
    </div>
  )
}
