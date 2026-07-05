import { useState } from 'react'
import { Info, AlertCircle } from 'lucide-react'

export const IntervalInput = ({ interval, onIntervalChange, disabled }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [rawValue, setRawValue] = useState(String(interval))

  const isInvalid = rawValue === '' || Number(rawValue) < 1

  const handleChange = (event) => {
    const raw = event.target.value
    setRawValue(raw)
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) {
      onIntervalChange(parsed)
    }
  }

  return (
    <div
      className="form-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label>Snapshot Interval:</label>
      <input
        type="number"
        min="1"
        step="0.1"
        value={rawValue}
        onChange={handleChange}
        disabled={disabled}
        style={isInvalid ? { borderColor: 'var(--error, #ef4444)' } : {}}
      />

      {isInvalid && (
        <div style={{
          marginTop: '8px',
          padding: '10px 12px',
          backgroundColor: 'var(--error-bg, #fef2f2)',
          borderRadius: 'var(--r-md)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={14} style={{ color: 'var(--error, #ef4444)', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--error, #ef4444)', lineHeight: 1.4 }}>
            Interval must be at least 1 second.
          </p>
        </div>
      )}

      {isHovered && !isInvalid && (
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