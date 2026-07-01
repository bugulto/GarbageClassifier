import { useState } from 'react'
import { UploadControls } from '../components/upload/UploadControls'
import { useUploadState } from '../components/upload/useUploadState'
import { ImagePreview } from '../components/upload/ImagePreview'
import { VideoPreview } from '../components/upload/VideoPreview'
import { CropSelector } from '../components/upload/CropSelector'
import { ResultSummary } from '../components/results/ResultSummary'
import { ClassSummaryCards } from '../components/results/ClassSummaryCards'
import { ResultImageGallery } from '../components/results/ResultImageGallery'
import { DetectionTable } from '../components/results/DetectionTable'
import { ChatPanel } from '../components/chat/ChatPanel'
import { Eye, UploadCloud } from 'lucide-react'

export const UploadPage = () => {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const uploadState = useUploadState({
    onUploadSuccess: setResult,
    onClearResult: () => setResult(null),
    setError
  })

  const renderVisuals = () => {
    if (result) {
      return <ResultImageGallery resultImages={result.result_images} />
    }
    if (uploadState.inputType === 'image' && uploadState.preview) {
      return <ImagePreview imageUrl={uploadState.preview} />
    }
    if (uploadState.inputType === 'video' && uploadState.preview) {
      return (
        <div className="page-stack" style={{ height: '100%' }}>
          <div style={{ flex: 4, minHeight: 0 }}>
            <VideoPreview videoUrl={uploadState.preview} onFrameCapture={uploadState.handleFrameCapture} />
          </div>
          <div style={{ flex: 6, minHeight: 0 }}>
            <CropSelector
              videoUrl={uploadState.preview}
              imageSrc={uploadState.frameUrl}
              crop={uploadState.crop}
              onCropChange={uploadState.setCrop}
              onFrameReady={uploadState.handleFrameCapture}
              disabled={uploadState.submitting}
            />
          </div>
        </div>
      )
    }
    return (
      <div className="panel-centered-empty">
        <Eye size={28} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <p className="text-muted" style={{ fontSize: '12px' }}>Upload or select a sample to preview</p>
      </div>
    )
  }

  return (
    <div className="page-viewport-locked">
      <div className="dashboard-grid">

        <div className="page-stack">
          <div className="chat-panel" style={{ flex: 1, minHeight: 0 }}>
            <div className="chat-header">
              <UploadCloud size={18} className="text-muted" />
              Upload and Analyse
            </div>
            <div className="panel-body">
              <UploadControls state={uploadState} />
              {error && <div className="alert-box alert-error" style={{ marginTop: '10px', marginBottom: 0 }}>{error}</div>}
            </div>
          </div>

          {result && (
            <div style={{ flexShrink: 0, maxHeight: '200px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <ClassSummaryCards summary={result.summary} />
            </div>
          )}
        </div>


        <div className="page-stack">
          <div style={{ flex: result ? '1 1 64%' : '1 1 100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="dashboard-pane-scroll panel-scroll">
              {renderVisuals()}
            </div>
          </div>

          {result && (
            <div style={{ flex: '1 1 36%', minHeight: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
              <div className="dashboard-pane-scroll panel-scroll">
                <DetectionTable resultImages={result.result_images} />
              </div>
            </div>
          )}
        </div>


        <div className="page-stack">

          {result && (
            <div style={{ flexShrink: 0 }}>
              <ResultSummary result={result} />
            </div>
          )}

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <ChatPanel jobId={result?.job_id} />
          </div>
        </div>

      </div>
    </div>
  )
}