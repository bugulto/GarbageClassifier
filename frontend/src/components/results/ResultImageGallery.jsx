import { Image as ImageIcon } from 'lucide-react'

export const ResultImageGallery = ({ resultImages }) => {
  if (!resultImages || resultImages.length === 0) {
    return (
      <div className="chat-panel" style={{ marginBottom: 0 }}>
        <div className="chat-header">
          <ImageIcon size={18} className="text-muted" />
          Annotated Images
        </div>
        <div style={{ padding: '14px' }}>
          <p className="text-muted" style={{ fontSize: '13px' }}>No result images available.</p>
        </div>
      </div>
    )
  }

  const getGridStyle = () => {
    if (resultImages.length === 1) return { gridTemplateColumns: '1fr' }
    if (resultImages.length === 2) return { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }
    return {} // falls back to default css (minmax 200px)
  }

  const getImageHeight = () => {
    if (resultImages.length === 1) return '400px'
    if (resultImages.length === 2) return '280px'
    if (resultImages.length <= 4) return '200px'
    return undefined // falls back to css default (160px)
  }

  return (
    <div className="chat-panel" style={{ marginBottom: 0 }}>
      <div className="chat-header">
        <ImageIcon size={18} className="text-muted" />
        Annotated Images
      </div>
      <div className="dashboard-pane-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px' }}>
        <div className="image-grid" style={getGridStyle()}>
          {resultImages.map((img, index) => (
            <div key={index} className="result-image-card">
              {img.annotated_image_url ? (
                <img
                  src={img.annotated_image_url}
                  alt={`Result ${index + 1}`}
                  style={{ height: getImageHeight() }}
                />
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>No image</div>
              )}
              <div className="result-image-info">
                <span>
                  {img.snapshot_index != null ? `#${img.snapshot_index}` : `#${index + 1}`}
                  {img.timestamp_seconds != null && ` (${img.timestamp_seconds}s)`}
                </span>
                <span className="badge badge-gray">
                  {img.detection_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
