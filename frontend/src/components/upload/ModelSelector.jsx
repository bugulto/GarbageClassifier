const MODELS = ['yolo', 'faster_rcnn', 'ssd']

export const ModelSelector = ({ selectedModel, onModelChange, disabled }) => {
  return (
    <div className="form-group">
      <label>Select Model:</label>
      <select value={selectedModel} onChange={onModelChange} disabled={disabled}>
        <option value="">-- Choose a model --</option>
        {MODELS.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  )
}
