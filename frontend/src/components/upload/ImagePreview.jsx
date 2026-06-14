import { Image as ImageIcon } from 'lucide-react'

export const ImagePreview = ({ imageUrl }) => {
  if (!imageUrl) return null

  return (
    <div className="preview-container">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <ImageIcon size={18} className="text-muted" /> Image Preview
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--surface-hover)', borderRadius: 'var(--r-sm)', padding: '16px', border: '1px dashed var(--border)' }}>
        <img src={imageUrl} alt="preview" className="preview-image" style={{ maxHeight: '400px', objectFit: 'contain' }} />
      </div>
    </div>
  )
}
