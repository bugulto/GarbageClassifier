import { Image as ImageIcon } from 'lucide-react'

export const ImagePreview = ({ imageUrl }) => {
  if (!imageUrl) return null

  return (
    <div className="chat-panel" style={{ marginBottom: 0 }}>
      <div className="chat-header">
        <ImageIcon size={18} className="text-muted" />
        Image Preview
      </div>
      <div className="panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={imageUrl} alt="preview" className="preview-image" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
      </div>
    </div>
  )
}
