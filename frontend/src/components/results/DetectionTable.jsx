export const DetectionTable = ({ resultImages }) => {
  if (!resultImages || resultImages.length === 0) {
    return (
      <div className="detection-table-container">
        <h3>Detection Details</h3>
        <p>No detections available.</p>
      </div>
    )
  }

  // Flatten detections from all result images
  const rows = []
  resultImages.forEach((img, imgIndex) => {
    if (!img.detections || img.detections.length === 0) return

    img.detections.forEach((det) => {
      rows.push({
        imageLabel: img.snapshot_index != null ? `Snapshot #${img.snapshot_index}` : `Image #${imgIndex + 1}`,
        timestamp: img.timestamp_seconds != null ? `${img.timestamp_seconds}s` : '-',
        className: det.class_name,
        confidence: det.confidence,
        x1: det.bbox.x1,
        y1: det.bbox.y1,
        x2: det.bbox.x2,
        y2: det.bbox.y2,
      })
    })
  })

  if (rows.length === 0) {
    return (
      <div className="detection-table-container">
        <h3>Detection Details</h3>
        <p>No detections available.</p>
      </div>
    )
  }

  return (
    <div className="detection-table-container">
      <h3>Detection Details</h3>
      <table className="detection-table">
        <thead>
          <tr>
            <th>Image/Snapshot</th>
            <th>Timestamp</th>
            <th>Class</th>
            <th>Confidence</th>
            <th>x1</th>
            <th>y1</th>
            <th>x2</th>
            <th>y2</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.imageLabel}</td>
              <td>{row.timestamp}</td>
              <td>{row.className}</td>
              <td>{row.confidence.toFixed(3)}</td>
              <td>{row.x1}</td>
              <td>{row.y1}</td>
              <td>{row.x2}</td>
              <td>{row.y2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
