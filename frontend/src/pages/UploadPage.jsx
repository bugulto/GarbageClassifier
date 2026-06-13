import { useState } from 'react'
import { UploadForm } from '../components/upload/UploadForm'
import { ResultView } from '../components/results/ResultView'

export const UploadPage = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="page-container">
      <h1>Garbage Classification Upload</h1>

      <UploadForm
        onUploadSuccess={setResult}
        setLoading={setLoading}
        setError={setError}
      />

      {loading && <p className="loading-text">Processing...</p>}
      {error && <p className="error-text">{error}</p>}
      {result && <ResultView result={result} />}
    </div>
  )
}