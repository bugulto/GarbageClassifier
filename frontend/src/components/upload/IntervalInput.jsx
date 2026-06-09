export const IntervalInput = ({ interval, onIntervalChange, disabled }) => {
  return (
    <div className="form-group">
      <label>Snapshot Interval (seconds):</label>
      <input
        type="number"
        min="0.1"
        step="0.1"
        value={interval}
        onChange={(event) => onIntervalChange(Number(event.target.value))}
        disabled={disabled}
      />
    </div>
  )
}
