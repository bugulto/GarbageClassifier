import { Tags } from 'lucide-react'

export const ClassSummaryCards = ({ summary }) => {
  if (!summary || Object.keys(summary).length === 0) {
    return (
      <div className="chat-panel" style={{ flex: 1, minHeight: 0, marginBottom: 0 }}>
        <div className="chat-header">
          <Tags size={18} className="text-muted" />
          Detected Classes
        </div>
        <div style={{ padding: '14px' }}>
          <p className="text-muted" style={{ fontSize: '14px', margin: 0 }}>No objects detected.</p>
        </div>
      </div>
    )
  }

  // Find max count to highlight the dominant class
  const maxCount = Math.max(...Object.values(summary))

  return (
    <div className="chat-panel" style={{ flex: 1, minHeight: 0, marginBottom: 0 }}>
      <div className="chat-header">
        <Tags size={18} className="text-muted" />
        Detected Classes
      </div>
      <div className="dashboard-pane-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px' }}>
        {Object.entries(summary).map(([className, count], idx, arr) => (
          <div
            key={className}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid var(--border)' }}
          >
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{className}</span>
            <span style={{ fontWeight: 600, color: count === maxCount ? 'var(--primary-green)' : 'var(--text-secondary)' }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
