export const HistoryFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (event) => {
    const { name, value } = event.target

    onFilterChange({
      ...filters,
      [name]: value,
    })
  }

  return (
    <div className="history-filters">
      <label>
        Input Type:
        <select
          name="input_type"
          value={filters.input_type}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </label>

      <label>
        Model:
        <select
          name="model_type"
          value={filters.model_type}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="yolo">YOLO</option>
          <option value="faster_rcnn">Faster R-CNN</option>
          <option value="ssd">SSD</option>
        </select>
      </label>

      <label>
        Status:
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </label>

      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}