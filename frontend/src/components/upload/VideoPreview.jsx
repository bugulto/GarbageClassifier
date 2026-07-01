import { useRef, useEffect } from 'react'
import { Film } from 'lucide-react'

export const VideoPreview = ({ videoUrl, onFrameCapture }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!onFrameCapture) return
    const video = videoRef.current
    if (!video) return

    const capture = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) return
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        onFrameCapture(
          canvas.toDataURL('image/jpeg', 0.85),
          video.videoWidth,
          video.videoHeight
        )
      }
    }

    video.addEventListener('pause', capture)
    video.addEventListener('seeked', capture)
    return () => {
      video.removeEventListener('pause', capture)
      video.removeEventListener('seeked', capture)
    }
  }, [onFrameCapture])

  if (!videoUrl) return null

  return (
    <div className="chat-panel" style={{ marginBottom: 0 }}>
      <div className="chat-header">
        <Film size={18} className="text-muted" />
        Video Preview
      </div>
      <div className="panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          style={{ maxHeight: '100%', maxWidth: '100%', display: 'block', borderRadius: '6px' }}
        />
      </div>
    </div>
  )
}
