import { Card } from '../ui/Card'

export const ClassSummaryCards = ({ summary }) => {
  if (!summary || Object.keys(summary).length === 0) {
    return (
      <Card className="class-summary">
        <div className="card-header">
          <h3>Detected Classes</h3>
        </div>
        <p className="text-muted" style={{ fontSize: '14px' }}>No objects detected.</p>
      </Card>
    )
  }

  // Find max count to highlight the dominant class
  const maxCount = Math.max(...Object.values(summary))

  return (
    <Card className="class-summary">
      <div className="card-header">
        <h3>Detected Classes</h3>
      </div>
      <div>
        {Object.entries(summary).map(([className, count]) => (
          <span 
            key={className} 
            className={`class-chip ${count === maxCount ? 'class-chip-highlight' : ''}`}
          >
            {className} <strong style={{ marginLeft: '4px' }}>{count}</strong>
          </span>
        ))}
      </div>
    </Card>
  )
}
