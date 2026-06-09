export const FileInput = ({ inputType, onFileChange, disabled }) => {
  const accept = inputType === 'image' ? 'image/*' : 'video/*'

  return (
    <div className="form-group">
      <label>Upload {inputType}:</label>
      <input
        type="file"
        accept={accept}
        onChange={onFileChange}
        disabled={disabled}
      />
    </div>
  )
}
