import { useState } from 'react'
import { Info } from 'lucide-react'

export const IntervalInput = ({ interval, onIntervalChange, disabled }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="form-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label>Snapshot Interval:</label>
      <input
        type="number"
        min="0.1"
        step="0.1"
        value={interval}
        onChange={(event) => onIntervalChange(Number(event.target.value))}
        disabled={disabled}
      />
      {isHovered && (
        <div style={{
          marginTop: '8px',
          padding: '10px 12px',
          backgroundColor: 'var(--light-green)',
          border: '1px solid #ccfbf1',
          borderRadius: 'var(--r-md)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start'
        }}>
          <Info size={14} style={{ color: 'var(--teal-accent)', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--teal-accent)', lineHeight: 1.4, opacity: 0.9 }}>
            Enter the time in seconds it takes for a moving piece of garbage to enter the crop region and fully exit it.
          </p>
        </div>
      )}
    </div>
  )
}
