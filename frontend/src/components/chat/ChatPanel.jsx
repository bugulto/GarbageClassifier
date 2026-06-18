import { useState, useImperativeHandle, forwardRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { askQuestion } from '../../services/chatApi'
import { MessageCircle } from 'lucide-react'

export const ChatPanel = forwardRef(({ jobId }, ref) => {
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
      console.error(error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Could not get a response.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    handleSend
  }))

  const title = jobId
    ? 'Ask about this result'
    : 'Garbage Classification Chatbot'
    
  const placeholderText = jobId
    ? "Ask about this classification result..."
    : "Ask about all saved classification jobs..."

  const jobExamples = [
    "Summarize this result.",
    "What waste type is dominant?",
    "What should the sorting operator do?",
    "How many total items were detected?"
  ]

  const globalExamples = [
    "Which waste type appears most often overall?",
    "Summarize the latest upload.",
    "How many recyclable items were detected?",
    "Which model was used most recently?",
    "What should the operator focus on?",
    "Which class appears most often overall?",
    "Summarize all previous jobs.",
    "What was detected in the latest upload?"
  ]

  const examples = jobId ? jobExamples : globalExamples

  return (
    <div className={`chat-panel ${!jobId ? 'chat-panel-centered' : ''}`}>
      <div className="chat-header">
        <MessageCircle size={18} className="text-muted" />
        {title}
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state" style={{ padding: '24px 16px', background: 'transparent', border: 'none' }}>
            <p className="text-muted" style={{ marginBottom: '16px' }}>No messages yet. Ask a question or try an example!</p>
            <div className="chat-example-prompts">
              {examples.map((ex, i) => (
                <button key={i} className="chat-example-btn" onClick={() => handleSend(ex)} disabled={loading}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <p className="text-muted" style={{ fontSize: '13px', marginLeft: '12px' }}>Thinking...</p>}
      </div>
      <div className="chat-input-container">
        <ChatInput onSend={handleSend} disabled={loading} placeholder={placeholderText} />
      </div>
    </div>
  )
})
