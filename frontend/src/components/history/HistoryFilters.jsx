import { Card } from '../ui/Card'
import { Filter } from 'lucide-react'

export const HistoryFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (event) => {
    const { name, value } = event.target

    onFilterChange({
      ...filters,
      [name]: value,
    })
  }

  return (
    <Card style={{ marginBottom: '24px' }}>
      <div className="history-filters filter-row">
        <div className="form-group filter-group">
          <label>Input Type</label>
          <select
            name="input_type"
            value={filters.input_type}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="form-group filter-group">
          <label>Model</label>
          <select
            name="model_type"
            value={filters.model_type}
            onChange={handleChange}
          >
            <option value="">All Models</option>
            <option value="yolo">YOLO</option>
            <option value="faster_rcnn">Faster R-CNN</option>
            <option value="ssd">SSD</option>
          </select>
        </div>

        <div className="form-group filter-group">
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button type="button" onClick={onReset} className="btn-secondary" style={{ marginBottom: '0px' }}>
          <Filter size={14} /> Reset
        </button>
      </div>
    </Card>
  )
}