import { useRef, useState } from 'react'

export const VideoPreview = ({ videoUrl, onFrameCapture }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [frameUrl, setFrameUrl] = useState(null)

  const captureFirstFrame = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const url = canvas.toDataURL('image/jpeg')
    setFrameUrl(url)
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
      <h3>Video Preview</h3>
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="preview-video"
        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={captureFirstFrame}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {frameUrl && (
        <div>
          <p>First Frame:</p>
          <img src={frameUrl} alt="first frame" className="preview-image" />
        </div>
      )}
    </div>
  )
}
