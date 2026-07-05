import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ResultSummary } from '../components/results/ResultSummary'
import { ClassSummaryCards } from '../components/results/ClassSummaryCards'
import { ResultImageGallery } from '../components/results/ResultImageGallery'
import { DetectionTable } from '../components/results/DetectionTable'
import { ChatPanel } from '../components/chat/ChatPanel'
import { getJobDetail } from '../services/resultsApi'
import { ArrowLeft, FileText } from 'lucide-react'

export const ResultDetailPage = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getJobDetail(jobId)
        setResult(data)
      } catch {
        setError('Failed to load job details.')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [jobId])



  if (loading) {
    return (
      <div className="page-viewport-locked" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="alert-box alert-loading">Loading job details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-viewport-locked" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="alert-box alert-error">{error}</div>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="page-viewport-locked">

      <div className="page-header-row">
        <div className="page-header-group">
          <button onClick={() => navigate('/history')} className="btn-outline compact-button" style={{ border: 'none', background: 'var(--surface)' }}>
            <ArrowLeft size={16} /> Back to History
          </button>
          <div className="header-divider"></div>
          <div className="detail-shell">
            <FileText size={18} className="text-muted" />
            <h1 className="title-inline">
              {result.original_filename}
            </h1>
          </div>
        </div>
      </div>


      <div className="dashboard-grid">

        <div className="page-stack">
          <div style={{ flexShrink: 0 }}>
            <ResultSummary result={result} isJobDetail={true} />
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ClassSummaryCards summary={result.summary} />
          </div>
        </div>


        <div className="page-stack">
          <div style={{ flex: '1 1 64%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ResultImageGallery resultImages={result.result_images} />
          </div>
          <div style={{ flex: '1 1 36%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <DetectionTable resultImages={result.result_images} />
          </div>
        </div>


        <div className="page-stack">
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <ChatPanel jobId={jobId} />
          </div>
        </div>
      </div>
    </div>
  )
}
