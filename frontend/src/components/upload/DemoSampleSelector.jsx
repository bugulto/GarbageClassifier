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
    <div className="demo-sample-box">
      <h3 style={{ marginBottom: '4px', color: 'var(--dark-green)' }}>Try a sample</h3>
      <p style={{ fontSize: '13px', color: 'var(--primary-green)', opacity: 0.8, marginBottom: '12px' }}>
        Use a sample image or video without uploading your own file.
      </p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => loadDemoFile('image')}
          disabled={disabled}
        >
          Demo Image
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => loadDemoFile('video')}
          disabled={disabled}
        >
          Demo Video
        </button>
      </div>
    </div>
  )
}