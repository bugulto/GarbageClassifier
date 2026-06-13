import { Card } from '../ui/Card'

export const ResultImageGallery = ({ resultImages }) => {
  if (!resultImages || resultImages.length === 0) {
    return (
      <Card className="result-gallery">
        <p className="text-muted">No result images available.</p>
      </Card>
    )
  }

  return (
    <Card className="result-gallery">
      <div className="image-grid">
        {resultImages.map((img, index) => (
          <div key={index} className="result-image-card">
            {img.annotated_image_url ? (
              <img
                src={img.annotated_image_url}
                alt={`Result ${index + 1}`}
              />
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No image available</div>
            )}
            <div className="result-image-info">
              <span>
                {img.snapshot_index != null ? `Snapshot #${img.snapshot_index}` : `Image #${index + 1}`}
                {img.timestamp_seconds != null && ` (${img.timestamp_seconds}s)`}
              </span>
              <span className="badge badge-gray">
                {img.detection_count} detections
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
