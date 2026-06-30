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

      <div style={{ padding: '14px' }}>
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
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span className="text-muted">Filename</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {result.original_filename || '-'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span className="text-muted">Date Created</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {result.created_at ? new Date(result.created_at).toLocaleString() : '-'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span className="text-muted">Status</span>
              <Badge variant={result.status === 'completed' ? 'green' : result.status === 'failed' ? 'red' : 'warning'} style={{ textTransform: 'capitalize' }}>
                {result.status || 'Unknown'}
              </Badge>
            </div>
          </div>
        )}

        {result.status === 'failed' && (
          <div style={{
            marginTop: '12px',
            background: 'var(--error-bg)',
            border: '1px solid var(--border)',
            padding: '14px',
            borderRadius: 'var(--r-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--error)' }}>
              Status: Failed
            </span>
            <p style={{ fontSize: '11.5px', color: 'var(--error)', opacity: 0.85, margin: 0, lineHeight: 1.4 }}>
              {result.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
