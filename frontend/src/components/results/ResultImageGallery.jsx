export const ResultImageGallery = ({ resultImages }) => {
  if (!resultImages || resultImages.length === 0) {
    return <p className="text-muted" style={{ fontSize: '13px' }}>No result images available.</p>
  }

  return (
    <div className="image-grid">
      {resultImages.map((img, index) => (
        <div key={index} className="result-image-card">
          {img.annotated_image_url ? (
            <img
              src={img.annotated_image_url}
              alt={`Result ${index + 1}`}
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
  )
}
