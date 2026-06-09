import { useState, useEffect } from 'react'
import { JobHistoryTable } from '../components/history/JobHistoryTable'
import { getJobs } from '../services/resultsApi'

export const HistoryPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs()
        setJobs(data)
      } catch (err) {
        setError('Failed to load job history.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <div className="page-container">
      <h1>Job History</h1>

      {loading && <p className="loading-text">Loading history...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && <JobHistoryTable jobs={jobs} />}
    </div>
  )
}
