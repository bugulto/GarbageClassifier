import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const DetectionTable = ({ resultImages }) => {
  const [showBbox, setShowBbox] = useState(false)

  if (!resultImages || resultImages.length === 0) {
    return <p className="text-muted" style={{ fontSize: '13px' }}>No detections available.</p>
  }

  // Flatten detections from all result images
  const rows = []
  resultImages.forEach((img, imgIndex) => {
    if (!img.detections || img.detections.length === 0) return

    img.detections.forEach((det) => {
      rows.push({
        imageLabel: img.snapshot_index != null ? `#${img.snapshot_index}` : `#${imgIndex + 1}`,
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
    return <p className="text-muted" style={{ fontSize: '13px' }}>No detections available.</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
        <button 
          type="button" 
          onClick={() => setShowBbox(!showBbox)}
          className="btn-outline"
          style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px' }}
        >
          {showBbox ? <><ChevronUp size={12}/> Hide Bbox</> : <><ChevronDown size={12}/> Show Bbox</>}
        </button>
      </div>
      
      <div className="table-scroll-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Snapshot</th>
              <th>Time</th>
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
                {showBbox && <td className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{row.x1.toFixed(0)}</td>}
                {showBbox && <td className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{row.y1.toFixed(0)}</td>}
                {showBbox && <td className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{row.x2.toFixed(0)}</td>}
                {showBbox && <td className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{row.y2.toFixed(0)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
