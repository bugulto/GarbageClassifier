import { useState } from 'react'
import { Card } from '../ui/Card'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const DetectionTable = ({ resultImages }) => {
  const [showBbox, setShowBbox] = useState(false)

  if (!resultImages || resultImages.length === 0) {
    return (
      <Card className="detection-table-container">
        <p className="text-muted">No detections available.</p>
      </Card>
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
      <Card className="detection-table-container">
        <p className="text-muted">No detections available.</p>
      </Card>
    )
  }

  return (
    <Card className="detection-table-container">
      <div className="card-header">
        <h3>Detection Details</h3>
        <button 
          type="button" 
          onClick={() => setShowBbox(!showBbox)}
          className="btn-outline"
          style={{ fontSize: '13px', padding: '6px 12px', borderRadius: '16px' }}
        >
          {showBbox ? <><ChevronUp size={14}/> Hide Technical</> : <><ChevronDown size={14}/> Show Technical</>}
        </button>
      </div>
      
      <div className="table-scroll-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image/Snapshot</th>
              <th>Timestamp</th>
              <th>Class</th>
              <th>Confidence</th>
              {showBbox && <th>x1</th>}
              {showBbox && <th>y1</th>}
              {showBbox && <th>x2</th>}
              {showBbox && <th>y2</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.imageLabel}</td>
                <td className="text-muted">{row.timestamp}</td>
                <td><span className="class-chip" style={{ marginBottom: 0 }}>{row.className}</span></td>
                <td>{(row.confidence * 100).toFixed(1)}%</td>
                {showBbox && <td className="text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{row.x1.toFixed(1)}</td>}
                {showBbox && <td className="text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{row.y1.toFixed(1)}</td>}
                {showBbox && <td className="text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{row.x2.toFixed(1)}</td>}
                {showBbox && <td className="text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{row.y2.toFixed(1)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
