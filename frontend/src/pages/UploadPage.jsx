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
  const [, setLoading] = useState(false)
  const [error, setError] = useState('')

  const uploadState = useUploadState({
    onUploadSuccess: setResult,
    onClearResult: () => setResult(null),
    setLoading,
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
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
      <div style={{
        height: '100%', minHeight: '120px', border: '2px dashed var(--border)', borderRadius: 'var(--r-lg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface)', gap: '8px'
      }}>
        <Eye size={28} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <p className="text-muted" style={{ fontSize: '12px' }}>Upload or select a sample to preview</p>
      </div>
    )
  }

  return (
    <div className="page-viewport-locked">
      <div className="dashboard-grid">

        {/* ── LEFT COLUMN: Controls & Quick Stats ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>
          <div className="chat-panel" style={{ flex: 1, minHeight: 0 }}>
            <div className="chat-header">
              <UploadCloud size={18} className="text-muted" />
              Upload and Analyse
            </div>
            <div style={{ padding: '14px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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

        {/* ── MIDDLE COLUMN: Visuals (top) & Table (bottom) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>

          {/* Visuals area */}
          <div style={{ flex: result ? '1 1 55%' : '1 1 100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="dashboard-pane-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {renderVisuals()}
            </div>
          </div>

          {/* Table area */}
          {result && (
            <div style={{ flex: '1 1 45%', minHeight: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
              <div className="dashboard-pane-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                <DetectionTable resultImages={result.result_images} />
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Summary & Chat ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>

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