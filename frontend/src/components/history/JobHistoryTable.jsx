import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { EmptyState } from '../shared/EmptyState'
import { Badge } from '../ui/Badge'
import { getStatusVariant } from '../../utils/status'
import { Eye, SearchX } from 'lucide-react'

export const JobHistoryTable = ({ jobs }) => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)')

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches)
    }

    updateIsMobile()
    mediaQuery.addEventListener('change', updateIsMobile)

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile)
    }
  }, [])

  if (!jobs || jobs.length === 0) {
    return (
      <div className="history-empty-wrap">
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
      <span key={cls} className="class-chip history-summary-chip">
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

  const openJobDetail = (jobId) => {
    if (isMobile) {
      navigate(`/history/${jobId}`)
    }
  }


  return (
    <div className="table-scroll-wrapper table-shell">
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
            <tr
              key={job.job_id}
              className={isMobile ? 'history-row history-row-mobile' : 'history-row'}
              onClick={() => openJobDetail(job.job_id)}
              role={isMobile ? 'button' : undefined}
              tabIndex={isMobile ? 0 : undefined}
              onKeyDown={(event) => {
                if (!isMobile) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openJobDetail(job.job_id)
                }
              }}
            >
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
                <div className="history-summary-chips">
                  {formatSummary(job.summary)}
                </div>
              </td>
              <td className="history-row-action">
                <Link to={`/history/${job.job_id}`}>
                  <button className="btn-secondary compact-button-sm" type="button">
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