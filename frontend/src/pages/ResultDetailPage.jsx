import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ResultSummary } from '../components/results/ResultSummary'
import { ClassSummaryCards } from '../components/results/ClassSummaryCards'
import { ResultImageGallery } from '../components/results/ResultImageGallery'
import { DetectionTable } from '../components/results/DetectionTable'
import { ChatPanel } from '../components/chat/ChatPanel'
import { getJobDetail } from '../services/resultsApi'
import { Badge } from '../components/ui/Badge'
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
      } catch (err) {
        console.error(err)
        setError('Failed to load job details.')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [jobId])

  const getStatusVariant = (status) => {
    if (status === 'completed') return 'green'
    if (status === 'failed') return 'red'
    return 'warning'
  }

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
      {/* Compact header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexShrink: 0 }}>
        <button onClick={() => navigate('/history')} className="btn-outline" style={{ padding: '5px 8px', border: 'none' }}>
          <ArrowLeft size={16} />
        </button>
        <FileText size={16} className="text-muted" />
        <h2 style={{ marginBottom: 0, fontSize: '15px' }}>
          {result.original_filename}
        </h2>
        <Badge variant={getStatusVariant(result.status)}>
          {result.message || result.status || 'Unknown'}
        </Badge>
      </div>

      {/* 3-column grid matching the upload page */}
      <div className="dashboard-grid">

        {/* LEFT: Summary + Detected Classes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ flexShrink: 0 }}>
            <ResultSummary result={result} />
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ClassSummaryCards summary={result.summary} />
          </div>
        </div>

        {/* MIDDLE: Images + Detection Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ flex: '1 1 55%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="dashboard-pane-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <ResultImageGallery resultImages={result.result_images} />
            </div>
          </div>
          <div style={{ flex: '1 1 45%', minHeight: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
            <div className="dashboard-pane-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <DetectionTable resultImages={result.result_images} />
            </div>
          </div>
        </div>

        {/* RIGHT: Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <ChatPanel jobId={jobId} />
          </div>
        </div>
      </div>
    </div>
  )
}
