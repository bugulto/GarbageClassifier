export const ChatMessage = ({ role, content }) => {
  return (
    <div className={`chat-message chat-message-${role}`}>
      <span className="chat-role">{role === 'user' ? 'You' : 'Assistant'}:</span>
      <span className="chat-content">{content}</span>
    </div>
  )
}
