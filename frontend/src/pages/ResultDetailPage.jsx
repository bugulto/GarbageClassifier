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
      {/* Premium header bar */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/history')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '13px', border: 'none', background: 'var(--surface)' }}>
            <ArrowLeft size={16} /> Back to History
          </button>
          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} className="text-muted" />
            <h1 style={{ marginBottom: 0, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--primary-green)' }}>
              {result.original_filename}
            </h1>
          </div>
        </div>
      </div>

      {/* 3-column grid matching the upload page */}
      <div className="dashboard-grid">

        {/* LEFT: Summary + Detected Classes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ flexShrink: 0 }}>
            <ResultSummary result={result} isJobDetail={true} />
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ClassSummaryCards summary={result.summary} />
          </div>
        </div>

        {/* MIDDLE: Images + Detection Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ flex: '1 1 64%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ResultImageGallery resultImages={result.result_images} />
          </div>
          <div style={{ flex: '1 1 36%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <DetectionTable resultImages={result.result_images} />
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
