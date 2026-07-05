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
    <form onSubmit={handleSubmit} className="upload-form upload-form-shell">
      <div className="dashboard-pane-scroll upload-controls-scroll">
        <DemoSampleSelector onDemoSelected={handleDemoSelected} disabled={submitting} />

        <div className="form-group">
          <label>Input Source</label>
          <select value={inputType} onChange={handleInputTypeChange} disabled={submitting} className="upload-input-select">
            <option value="image">Upload Image</option>
            <option value="video">Video Stream</option>
          </select>
        </div>

        <div className="page-stack" style={{ gap: '6px' }}>
          <FileInput inputType={inputType} onFileChange={handleFileChange} disabled={submitting} />
          {file && (
            <p className="upload-preview-file">
              Selected file: <strong>{file.name}</strong>
            </p>
          )}
        </div>

        {inputType === 'video' && (
          <IntervalInput interval={interval} onIntervalChange={setInterval} disabled={submitting} />
        )}

        <ModelSelector selectedModel={modelType} onModelChange={(event) => setModelType(event.target.value)} disabled={submitting} />
      </div>

      <div className="upload-controls-actions">
        <button type="submit" className="btn-primary upload-submit" disabled={submitting || !file || !modelType || interval < 1}>
          {submitting ? 'Processing...' : 'Analyse Garbage'}
        </button>
      </div>
    </form>
  )
}
