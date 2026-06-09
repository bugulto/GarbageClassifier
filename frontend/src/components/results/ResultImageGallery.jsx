const API_BASE_URL = 'http://127.0.0.1:8000'

export const ResultImageGallery = ({ resultImages }) => {
  if (!resultImages || resultImages.length === 0) {
    return (
      <div className="result-gallery">
        <h3>Annotated Images</h3>
        <p>No result images available.</p>
      </div>
    )
  }

  return (
    <div className="result-gallery">
      <h3>Annotated Images</h3>
      <div className="gallery-grid">
        {resultImages.map((img, index) => (
          <div key={index} className="gallery-item">
            {img.annotated_image_url ? (
              <img
                src={img.annotated_image_url}
                alt={`Result ${index + 1}`}
                className="gallery-image"
              />
            ) : (
              <div className="gallery-placeholder">No image available</div>
            )}
            <div className="gallery-info">
              {img.snapshot_index != null && (
                <span>Snapshot #{img.snapshot_index}</span>
              )}
              {img.timestamp_seconds != null && (
                <span> | Timestamp: {img.timestamp_seconds}s</span>
              )}
              <span> | Detections: {img.detection_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
