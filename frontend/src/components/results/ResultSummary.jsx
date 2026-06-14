import { StatCard } from '../ui/StatCard'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { BoxSelect, Camera, Image as ImageIcon, Cpu } from 'lucide-react'

export const ResultSummary = ({ result }) => {
  const getStatusVariant = (status) => {
    if (status === 'completed') return 'green'
    if (status === 'failed') return 'red'
    return 'warning'
  }

  return (
    <Card className="result-summary">
      <div className="card-header">
        <h3>Analysis Summary</h3>
      </div>
      
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

      <table className="summary-table">
        <tbody>
          <tr>
            <td>Job ID</td>
            <td style={{ fontFamily: 'var(--font-mono)' }}>{result.job_id}</td>
          </tr>
          <tr>
            <td>Filename</td>
            <td>{result.original_filename}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <Badge variant={getStatusVariant(result.status)}>
                {result.message || result.status || 'Unknown'}
              </Badge>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}
