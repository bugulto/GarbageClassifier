import { useState, useEffect } from 'react'
import { JobHistoryTable } from '../components/history/JobHistoryTable'
import { HistoryFilters } from '../components/history/HistoryFilters'
import { getJobs } from '../services/resultsApi'
import { SectionHeader } from '../components/ui/SectionHeader'
import { History } from 'lucide-react'
import { Card } from '../components/ui/Card'

const DEFAULT_FILTERS = {
  input_type: '',
  model_type: '',
  status: '',
}

export const HistoryPage = () => {
  const [jobs, setJobs] = useState([])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchJobs = async (currentFilters = filters) => {
    setLoading(true)
    setError('')

    try {
      const activeFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([, value]) => value !== '')
      )

      const data = await getJobs(activeFilters)
      setJobs(data)
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Failed to load job history.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(DEFAULT_FILTERS)
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    fetchJobs(newFilters)
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    fetchJobs(DEFAULT_FILTERS)
  }

  return (
    <div className="page-container">
      <SectionHeader 
        title="Job History" 
        subtitle="Review and filter past classification jobs."
        icon={History}
        className="page-header"
      />

      <HistoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {loading && <div className="alert-box alert-loading">Loading history...</div>}
      {error && <div className="alert-box alert-error">{error}</div>}

      {!loading && !error && (
        <Card style={{ padding: '0', overflow: 'hidden' }}>
          <JobHistoryTable jobs={jobs} />
        </Card>
      )}
    </div>
  )
}