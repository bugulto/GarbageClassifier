import { useState } from 'react'
import { FileInput } from './FileInput'
import { ModelSelector } from './ModelSelector'
import { IntervalInput } from './IntervalInput'
import { ImagePreview } from './ImagePreview'
import { VideoPreview } from './VideoPreview'
import { CropSelector } from './CropSelector'
import { uploadImage, uploadVideo } from '../../services/uploadApi'

const DEFAULT_CROP = {
  unit: '%',
  x: 10,
  y: 10,
  width: 80,
  height: 80,
}

export const UploadForm = ({ onUploadSuccess, setLoading, setError }) => {
  const [inputType, setInputType] = useState('image')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [modelType, setModelType] = useState('')
  const [interval, setInterval] = useState(1)
  const [crop, setCrop] = useState(DEFAULT_CROP)
  const [frameUrl, setFrameUrl] = useState(null)
  const [videoDimensions, setVideoDimensions] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleInputTypeChange = (event) => {
    const nextType = event.target.value

    setInputType(nextType)
    setFile(null)
    setPreview(null)
    setModelType('')
    setInterval(1)
    setCrop(DEFAULT_CROP)
    setFrameUrl(null)
    setVideoDimensions(null)
    setError('')
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setCrop(DEFAULT_CROP)
    setFrameUrl(null)
    setVideoDimensions(null)
    setError('')
  }

  const handleFrameCapture = (frameDataUrl, width, height) => {
    setFrameUrl(frameDataUrl)
    setVideoDimensions({ width, height })
  }

  const getVideoCropCoordinates = () => {
    if (!crop || !videoDimensions) return null

    const cropX = Number(crop.x || 0)
    const cropY = Number(crop.y || 0)
    const cropWidth = Number(crop.width || 0)
    const cropHeight = Number(crop.height || 0)

    if (cropWidth <= 0 || cropHeight <= 0) return null

    return {
      x: Math.round((cropX / 100) * videoDimensions.width),
      y: Math.round((cropY / 100) * videoDimensions.height),
      width: Math.round((cropWidth / 100) * videoDimensions.width),
      height: Math.round((cropHeight / 100) * videoDimensions.height),
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!file) {
      setError('Please select a file.')
      return
    }

    if (!modelType) {
      setError('Please select a model.')
      return
    }

    if (inputType === 'video' && !frameUrl) {
      setError('Please wait for the video preview to load.')
      return
    }

    if (inputType === 'video' && !getVideoCropCoordinates()) {
      setError('Please select a valid crop region.')
      return
    }

    setSubmitting(true)
    setLoading(true)
    setError('')

    try {
      let response

      if (inputType === 'image') {
        response = await uploadImage(file, modelType)
      } else {
        const realCrop = getVideoCropCoordinates()
        response = await uploadVideo(file, modelType, interval, realCrop)
      }

      onUploadSuccess(response)
    } catch (error) {
      const errorMsg =
        typeof error === 'string'
          ? error
          : error?.detail || error?.message || JSON.stringify(error)
      setError(`Upload failed: ${errorMsg}`)
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label>Input Type:</label>
        <select
          value={inputType}
          onChange={handleInputTypeChange}
          disabled={submitting}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      <FileInput
        inputType={inputType}
        onFileChange={handleFileChange}
        disabled={submitting}
      />

      {inputType === 'image' && <ImagePreview imageUrl={preview} />}

      {inputType === 'video' && (
        <VideoPreview
          videoUrl={preview}
          onFrameCapture={handleFrameCapture}
        />
      )}

      {inputType === 'video' && frameUrl && (
        <CropSelector
          imageSrc={frameUrl}
          crop={crop}
          onCropChange={setCrop}
          disabled={submitting}
        />
      )}

      {inputType === 'video' && (
        <IntervalInput
          interval={interval}
          onIntervalChange={setInterval}
          disabled={submitting}
        />
      )}

      <ModelSelector
        selectedModel={modelType}
        onModelChange={(event) => setModelType(event.target.value)}
        disabled={submitting}
      />

      <button type="submit" disabled={submitting || !file || !modelType}>
        {submitting ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  )
}
