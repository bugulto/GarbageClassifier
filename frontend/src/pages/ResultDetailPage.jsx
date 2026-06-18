import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ResultView } from '../components/results/ResultView'
import { ResultTabs } from '../components/results/ResultTabs'
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

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/history')} className="btn-outline" style={{ padding: '8px', border: 'none' }}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={24} className="text-muted" />
          {result ? result.original_filename : `Job Detail: ${jobId}`}
        </h1>
        {result && (
          <Badge variant={getStatusVariant(result.status)}>
            {result.message || result.status || 'Unknown'}
          </Badge>
        )}
      </div>

      {loading && (
        <div className="alert-box alert-loading">Loading job details...</div>
      )}
      {error && (
        <div className="alert-box alert-error">{error}</div>
      )}
      
      {result && (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-main">
              <ResultView result={result} />
            </div>

            <div className="dashboard-sidebar">
              <div className="sticky-sidebar">
                <ChatPanel jobId={jobId} />
              </div>
            </div>
          </div>
          <ResultTabs result={result} />
        </>
      )}
    </div>
  )
}
