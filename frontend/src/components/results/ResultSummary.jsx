import { StatCard } from '../ui/StatCard'
import { BoxSelect, Camera, Image as ImageIcon, Cpu, BarChart3 } from 'lucide-react'

export const ResultSummary = ({ result }) => {

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
