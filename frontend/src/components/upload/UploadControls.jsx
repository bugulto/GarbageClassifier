import { FileInput } from './FileInput'
import { ModelSelector } from './ModelSelector'
import { IntervalInput } from './IntervalInput'
import { DemoSampleSelector } from './DemoSampleSelector'

export const UploadControls = ({ state }) => {
  const {
    inputType, file, modelType, interval, submitting,
    handleInputTypeChange, handleFileChange, handleDemoSelected, handleSubmit, setModelType, setInterval
  } = state

  return (
    <form onSubmit={handleSubmit} className="upload-form" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="dashboard-pane-scroll" style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        paddingRight: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        <DemoSampleSelector onDemoSelected={handleDemoSelected} disabled={submitting} />

        <div className="form-group">
          <label>Input Source</label>
          <select value={inputType} onChange={handleInputTypeChange} disabled={submitting} style={{ padding: '8px 10px', fontSize: '13px' }}>
            <option value="image">Upload Image</option>
            <option value="video">Video Stream</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <FileInput inputType={inputType} onFileChange={handleFileChange} disabled={submitting} />
          {file && (
            <p style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--primary-green)', margin: 0 }}>
              Selected file: <strong>{file.name}</strong>
            </p>
          )}
        </div>

        {inputType === 'video' && (
          <IntervalInput interval={interval} onIntervalChange={setInterval} disabled={submitting} />
        )}

        <ModelSelector selectedModel={modelType} onModelChange={(event) => setModelType(event.target.value)} disabled={submitting} />
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '16px', flexShrink: 0 }}>
        <button type="submit" className="btn-primary" disabled={submitting || !file || !modelType} style={{ padding: '12px', fontSize: '14px', width: '100%', fontWeight: 600 }}>
          {submitting ? 'Processing...' : 'Analyse Garbage'}
        </button>
      </div>
    </form>
  )
}
