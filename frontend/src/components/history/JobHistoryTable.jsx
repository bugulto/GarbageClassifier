import { Link } from 'react-router-dom'

export const JobHistoryTable = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return <p>No jobs found.</p>
  }

  const formatSummary = (summary) => {
    if (!summary || Object.keys(summary).length === 0) return '-'
    return Object.entries(summary)
      .map(([cls, count]) => `${cls}: ${count}`)
      .join(', ')
  }

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString()
    } catch {
      return dateStr
    }
  }

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Created At</th>
          <th>Filename</th>
          <th>Input Type</th>
          <th>Model</th>
          <th>Summary</th>
          <th>Total Detections</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.job_id}>
            <td>{formatDate(job.created_at)}</td>
            <td>{job.original_filename}</td>
            <td>{job.input_type}</td>
            <td>{job.model_type}</td>
            <td>{formatSummary(job.summary)}</td>
            <td>{job.total_detections}</td>
            <td>
              <Link to={`/history/${job.job_id}`}>View</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
