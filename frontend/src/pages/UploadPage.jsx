import { useState } from 'react'
import { UploadForm } from '../components/upload/UploadForm'
import { ResultView } from '../components/results/ResultView'
import { ResultTabs } from '../components/results/ResultTabs'
import { ChatPanel } from '../components/chat/ChatPanel'
import { EmptyState } from '../components/shared/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { UploadCloud, Image as ImageIcon } from 'lucide-react'
import { Card } from '../components/ui/Card'

export const UploadPage = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="page-container">
      <SectionHeader 
        title="Upload & Analyze" 
        subtitle="Upload an image or video to classify detected garbage items using our AI models."
        icon={UploadCloud}
        className="page-header"
      />

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <Card>
            <UploadForm
              onUploadSuccess={setResult}
              setLoading={setLoading}
              setError={setError}
            />

            {loading && (
              <div className="alert-box alert-loading" style={{ marginTop: '20px' }}>
                Analyzing media, please wait...
              </div>
            )}
            {error && (
              <div className="alert-box alert-error" style={{ marginTop: '20px' }}>
                {error}
              </div>
            )}
          </Card>
        </div>

        <div className="dashboard-sidebar">
          {!result ? (
            <EmptyState 
              title="No Result Yet"
              description="Upload a file or choose a demo sample to view analysis here."
              icon={ImageIcon}
            />
          ) : (
            <div className="sticky-sidebar">
              <ResultView result={result} />
              <ChatPanel jobId={result.job_id} />
            </div>
          )}
        </div>
      </div>

      {result && <ResultTabs result={result} />}
    </div>
  )
}