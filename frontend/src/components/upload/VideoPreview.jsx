import { useRef } from 'react'
import { Video } from 'lucide-react'

export const VideoPreview = ({ videoUrl, onFrameCapture }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const captureFirstFrame = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const url = canvas.toDataURL('image/jpeg')
    onFrameCapture(url, video.videoWidth, video.videoHeight)
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return

    const targetTime = Number.isFinite(video.duration)
      ? Math.min(0.1, video.duration)
      : 0.1
    video.currentTime = targetTime
  }

  if (!videoUrl) return null

  return (
    <div className="preview-container">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Video size={18} className="text-muted" /> Video Preview
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--surface-hover)', borderRadius: 'var(--r-sm)', padding: '16px', border: '1px dashed var(--border)' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="preview-video"
          onLoadedMetadata={handleLoadedMetadata}
          onSeeked={captureFirstFrame}
          style={{ maxHeight: '400px' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  )
}
