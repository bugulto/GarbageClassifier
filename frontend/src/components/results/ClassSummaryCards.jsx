import { Tags } from 'lucide-react'

export const ClassSummaryCards = ({ summary }) => {
  if (!summary || Object.keys(summary).length === 0) {
    return (
      <div className="chat-panel chat-panel-compact result-summary-empty">
        <div className="chat-header">
          <Tags size={18} className="text-muted" />
          Detected Classes
        </div>
        <div className="panel-body-compact">
          <p className="text-muted result-summary-empty-text">No objects detected.</p>
        </div>
      </div>
    )
  }


  const maxCount = Math.max(...Object.values(summary))

  return (
    <div className="chat-panel chat-panel-compact result-summary-list">
      <div className="chat-header">
        <Tags size={18} className="text-muted" />
        Detected Classes
      </div>
      <div className="dashboard-pane-scroll result-summary-list-body">
        {Object.entries(summary).map(([className, count], idx, arr) => (
          <div
            key={className}
            className={`result-summary-item ${idx === arr.length - 1 ? 'result-summary-item-last' : ''}`}
          >
            <span className="result-summary-label">{className}</span>
            <span
              className="result-summary-count"
              style={{ color: count === maxCount ? 'var(--primary-green)' : 'var(--text-secondary)' }}
            >
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
