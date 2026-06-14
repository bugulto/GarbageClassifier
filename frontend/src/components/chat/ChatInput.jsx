import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'

export const ChatInput = ({ onSend, disabled, placeholder }) => {
  const [text, setText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!text.trim() || disabled) return

    onSend(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder || "Type your question..."}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !text.trim()} className="btn-primary" style={{ padding: '10px' }}>
        <SendHorizontal size={18} />
      </button>
    </form>
  )
}
