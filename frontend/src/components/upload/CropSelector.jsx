import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export const CropSelector = ({ imageSrc, crop, onCropChange, disabled }) => {
  if (!imageSrc) return null

  return (
    <div className="crop-container">
      <h3>Select Crop Region</h3>

      <ReactCrop
        crop={crop}
        onChange={(pixelCrop, percentCrop) => onCropChange(percentCrop)}
        disabled={disabled}
        keepSelection
      >
        <img
          src={imageSrc}
          alt="First video frame for crop selection"
          style={{
            maxWidth: '100%',
            display: 'block',
          }}
        />
      </ReactCrop>

      {crop?.width && crop?.height ? (
        <p>
          Crop: x={Math.round(crop.x)}%, y={Math.round(crop.y)}%, width=
          {Math.round(crop.width)}%, height={Math.round(crop.height)}%
        </p>
      ) : null}
    </div>
  )
}
