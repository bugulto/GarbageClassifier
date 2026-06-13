export const ImagePreview = ({ imageUrl }) => {
  if (!imageUrl) return null

  return (
    <div className="preview-container">
      <h3>Image Preview</h3>
      <img src={imageUrl} alt="preview" className="preview-image" />
    </div>
  )
}
