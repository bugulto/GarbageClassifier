export const DemoSampleSelector = ({ onDemoSelected, disabled }) => {
  const loadDemoFile = async (demoType) => {
    const demoConfig =
      demoType === 'image'
        ? {
          url: '/demo/demo-image.jpg',
          filename: 'demo-image.jpg',
          mimeType: 'image/jpeg',
          inputType: 'image',
        }
        : {
          url: '/demo/demo-video.mp4',
          filename: 'demo-video.mp4',
          mimeType: 'video/mp4',
          inputType: 'video',
        }

    const response = await fetch(demoConfig.url)

    if (!response.ok) {
      throw new Error(`Could not load ${demoConfig.filename}`)
    }

    const blob = await response.blob()

    const file = new File([blob], demoConfig.filename, {
      type: demoConfig.mimeType,
    })

    onDemoSelected({
      file,
      inputType: demoConfig.inputType,
    })
  }

  return (
    <div className="demo-sample-box" style={{ 
      background: 'var(--light-green)', 
      border: '1px solid var(--border)', 
      padding: '14px', 
      borderRadius: 'var(--r-md)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dark-green)' }}>Try a sample</span>
        
        <p style={{ fontSize: '11.5px', color: 'var(--teal-accent)', opacity: 0.85, margin: 0, lineHeight: 1.4 }}>
          Use a sample image or video without uploading your own file.
        </p>

        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => loadDemoFile('image')}
            disabled={disabled}
            style={{ fontSize: '12px', padding: '6px 12px', flex: 1, fontWeight: 500 }}
          >
            Image
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => loadDemoFile('video')}
            disabled={disabled}
            style={{ fontSize: '12px', padding: '6px 12px', flex: 1, fontWeight: 500 }}
          >
            Video
          </button>
        </div>
      </div>
    </div>
  )
}