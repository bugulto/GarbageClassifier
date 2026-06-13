import { useState } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { askQuestion } from '../../services/chatApi'

export const ChatPanel = ({ jobId }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (question) => {
    if (!question.trim()) return

    const userMessage = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await askQuestion(question, jobId)
      setMessages((prev) => [...prev, response])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Could not get a response.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const title = jobId
    ? 'Ask about this result'
    : 'Garbage Classification Chatbot'

  return (
    <div className="chat-panel">
      <h3>{title}</h3>
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">No messages yet. Ask a question!</p>
        )}
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <p className="chat-loading">Thinking...</p>}
      </div>
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  )
}
