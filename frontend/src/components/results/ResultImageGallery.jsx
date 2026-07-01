import { Image as ImageIcon } from 'lucide-react'

export const ResultImageGallery = ({ resultImages }) => {
  if (!resultImages || resultImages.length === 0) {
    return (
      <div className="chat-panel chat-panel-compact">
        <div className="chat-header">
          <ImageIcon size={18} className="text-muted" />
          Annotated Images
        </div>
        <div className="panel-body-compact">
          <p className="text-muted panel-empty-text">No result images available.</p>
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
    <div className="chat-panel chat-panel-compact">
      <div className="chat-header">
        <ImageIcon size={18} className="text-muted" />
        Annotated Images
      </div>
      <div className="dashboard-pane-scroll panel-image-stage">
        <div className="image-grid" style={getGridStyle()}>
          {resultImages.map((img, index) => (
            <div key={index} className="result-image-card">
              {img.annotated_image_url ? (
                <img
                  src={img.annotated_image_url}
                  alt={`Result ${index + 1}`}
                  className="result-image-frame"
                  style={{ height: getImageHeight() }}
                />
              ) : (
                <div className="result-image-placeholder">No image</div>
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
