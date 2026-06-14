import { Link } from 'react-router-dom'
import { EmptyState } from '../shared/EmptyState'
import { Badge } from '../ui/Badge'
import { Eye, SearchX } from 'lucide-react'

export const JobHistoryTable = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div style={{ padding: '40px 0' }}>
        <EmptyState 
          title="No History" 
          description="No job history found. Try adjusting your filters or uploading a file."
          icon={SearchX}
        />
      </div>
    )
  }

  const formatSummary = (summary) => {
    if (!summary || Object.keys(summary).length === 0) return '-'
    return Object.entries(summary).map(([cls, count]) => (
      <span key={cls} className="class-chip" style={{ marginBottom: 0, padding: '2px 6px' }}>
        {cls} {count}
      </span>
    ))
  }

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString()
    } catch {
      return dateStr
    }
  }

  const getStatusVariant = (status) => {
    if (status === 'completed') return 'green'
    if (status === 'failed') return 'red'
    return 'warning'
  }

  return (
    <div className="table-scroll-wrapper" style={{ margin: 0, padding: 0 }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Created At</th>
            <th>Filename</th>
            <th>Type</th>
            <th>Model</th>
            <th>Status</th>
            <th>Summary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.job_id}>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {formatDate(job.created_at)}
              </td>
              <td style={{ fontWeight: 500 }}>{job.original_filename}</td>
              <td><Badge variant="gray">{job.input_type}</Badge></td>
              <td><Badge variant="gray">{job.model_type}</Badge></td>
              <td>
                <Badge variant={getStatusVariant(job.status)}>
                  {job.status}
                </Badge>
              </td>
              <td>
                <div style={{ minWidth: '200px', flexWrap: 'wrap', gap: '4px', display: 'flex', alignItems: 'center' }}>
                  {formatSummary(job.summary)}
                </div>
              </td>
              <td>
                <Link to={`/history/${job.job_id}`}>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    <Eye size={14} /> View
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
