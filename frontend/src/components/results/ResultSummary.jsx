import { StatCard } from '../ui/StatCard'
import { Badge } from '../ui/Badge'
import { BoxSelect, Camera, Image as ImageIcon, Cpu, BarChart3 } from 'lucide-react'

export const ResultSummary = ({ result, isJobDetail }) => {

  return (
    <div className="chat-panel" style={{ marginBottom: 0 }}>
      <div className="chat-header">
        <BarChart3 size={18} className="text-muted" />
        Analysis Summary
      </div>

      <div className="panel-body">
        <div className="stat-grid">
          <StatCard
            label="Detections"
            value={result.total_detections}
            icon={BoxSelect}
          />
          <StatCard
            label="Images"
            value={result.total_result_images}
            icon={ImageIcon}
          />
          <StatCard
            label="Model"
            value={result.model_type}
            icon={Cpu}
            valueClass="text-muted"
          />
          <StatCard
            label="Input"
            value={result.input_type}
            icon={Camera}
            valueClass="text-muted"
          />
        </div>

        {isJobDetail && (
          <div className="summary-meta">
            <div className="summary-row">
              <span className="text-muted">Filename</span>
              <span className="summary-value summary-value-truncated">
                {result.original_filename || '-'}
              </span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Date Created</span>
              <span className="summary-value">
                {result.created_at ? new Date(result.created_at).toLocaleString() : '-'}
              </span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Status</span>
              <Badge variant={result.status === 'completed' ? 'green' : result.status === 'failed' ? 'red' : 'warning'} style={{ textTransform: 'capitalize' }}>
                {result.status || 'Unknown'}
              </Badge>
            </div>
          </div>
        )}

        {result.status === 'failed' && (
          <div className="summary-error">
            <span className="summary-error-title">
              Status: Failed
            </span>
            <p className="summary-error-text">
              {result.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
