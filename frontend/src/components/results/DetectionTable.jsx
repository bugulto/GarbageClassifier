import { useState } from 'react'
import { Table, ChevronDown, ChevronUp } from 'lucide-react'

export const DetectionTable = ({ resultImages }) => {
  const [showBbox, setShowBbox] = useState(false)

  if (!resultImages || resultImages.length === 0) {
    return (
      <div className="chat-panel chat-panel-compact">
        <div className="chat-header">
          <Table size={18} className="text-muted" />
          Detection Table
        </div>
        <div className="panel-body-compact">
          <p className="text-muted panel-empty-text">No detections available.</p>
        </div>
      </div>
    )
  }


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
    return (
      <div className="chat-panel chat-panel-compact">
        <div className="chat-header">
          <Table size={18} className="text-muted" />
          Detection Table
        </div>
        <div className="panel-body-compact">
          <p className="text-muted panel-empty-text">No detections available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-panel chat-panel-compact">
      <div className="chat-header panel-header-actions">
        <div className="panel-header-inline">
          <Table size={18} className="text-muted" />
          Detection Table
        </div>
        <button 
          type="button" 
          onClick={() => setShowBbox(!showBbox)}
          className="btn-outline result-table-toggle"
        >
          {showBbox ? <><ChevronUp size={12}/> Hide Details</> : <><ChevronDown size={12}/> Show Details</>}
        </button>
      </div>
      
      <div className="dashboard-pane-scroll panel-table-shell">
        <div className="table-scroll-wrapper panel-table-wrapper">
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
                  <td><span className="class-chip result-table-badge">{row.className}</span></td>
                  <td>{(row.confidence * 100).toFixed(1)}%</td>
                  {showBbox && <td className="text-muted result-table-bbox">{row.x1.toFixed(0)}</td>}
                  {showBbox && <td className="text-muted result-table-bbox">{row.y1.toFixed(0)}</td>}
                  {showBbox && <td className="text-muted result-table-bbox">{row.x2.toFixed(0)}</td>}
                  {showBbox && <td className="text-muted result-table-bbox">{row.y2.toFixed(0)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
