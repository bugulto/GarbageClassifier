import { ChatPanel } from '../components/chat/ChatPanel'

export const ChatPage = () => {
  return (
    <div className="page-container">
      <h1>Chat</h1>
      <p>Ask questions about garbage classification results across all jobs.</p>
      <ChatPanel />
    </div>
  )
}
