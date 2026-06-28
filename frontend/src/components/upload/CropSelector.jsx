import { useState, useEffect } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Crop } from 'lucide-react'

export const CropSelector = ({ videoUrl, imageSrc, crop, onCropChange, onFrameReady, disabled }) => {
  const [frameSrc, setFrameSrc] = useState(null)

  const displaySrc = imageSrc || frameSrc

  useEffect(() => {
    if (!videoUrl) return

    let active = true

    // Create a hidden video element to extract first frame
    const video = document.createElement('video')
    video.src = videoUrl
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.preload = 'metadata'

    video.addEventListener('loadeddata', () => {
      video.currentTime = 0
    })

    video.addEventListener('seeked', () => {
      if (!active) return
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setFrameSrc(dataUrl)
        if (onFrameReady) onFrameReady(dataUrl, video.videoWidth, video.videoHeight)
      }
      video.src = ''
    })

    video.load()

    return () => {
      active = false
      video.src = ''
    }
  }, [videoUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="chat-panel" style={{ marginBottom: 0 }}>
      <div className="chat-header">
        <Crop size={18} className="text-muted" />
        Select Crop Region
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {!displaySrc ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-muted" style={{ fontSize: '13px' }}>Loading first frame…</p>
          </div>
        ) : (
          <div style={{ position: 'absolute', inset: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => onCropChange(percentCrop)}
              disabled={disabled}
              style={{ display: 'inline-block', maxWidth: '100%', maxHeight: '100%' }}
            >
              <img
                src={displaySrc}
                alt="Video first frame"
                style={{ maxWidth: '100%', maxHeight: 'calc(60vh - 150px)', width: 'auto', height: 'auto', display: 'block' }}
              />
            </ReactCrop>
          </div>
        )}
      </div>
    </div>
  )
}
