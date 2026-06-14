export const FileInput = ({ inputType, onFileChange, disabled }) => {
  const accept = inputType === 'image' ? 'image/*' : 'video/*'

  return (
    <div className="form-group">
      <label>Upload {inputType}:</label>
      <input
        key={inputType}
        type="file"
        accept={accept}
        onChange={onFileChange}
        disabled={disabled}
        style={{
          border: '1px dashed var(--border)',
          padding: '16px',
          borderRadius: 'var(--r-md)',
          background: 'var(--surface-hover)',
          width: '100%',
          cursor: 'pointer'
        }}
      />
    </div>
  )
}
