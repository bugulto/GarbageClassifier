export const ClassSummaryCards = ({ summary }) => {
  if (!summary || Object.keys(summary).length === 0) {
    return (
      <div className="class-summary">
        <h3>Class Summary</h3>
        <p>No objects detected.</p>
      </div>
    )
  }

  return (
    <div className="class-summary">
      <h3>Class Summary</h3>
      <div className="class-cards">
        {Object.entries(summary).map(([className, count]) => (
          <div key={className} className="class-card">
            <div className="class-name">{className}</div>
            <div className="class-count">{count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
