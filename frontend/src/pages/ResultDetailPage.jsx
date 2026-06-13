import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ResultView } from '../components/results/ResultView'
import { ChatPanel } from '../components/chat/ChatPanel'
import { getJobDetail } from '../services/resultsApi'

export const ResultDetailPage = () => {
  const { jobId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getJobDetail(jobId)
        setResult(data)
      } catch (err) {
        setError('Failed to load job details.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [jobId])

  return (
    <div className="page-container">
      <Link to="/history">&larr; Back to History</Link>

      <h1>Job Detail: {jobId}</h1>

      {loading && <p className="loading-text">Loading job details...</p>}
      {error && <p className="error-text">{error}</p>}
      {result && <ResultView result={result} />}

      <hr />
      <ChatPanel jobId={jobId} />
    </div>
  )
}
