import { useState, useCallback } from 'react'
import { uploadImage, uploadVideo } from '../../services/uploadApi'

const DEFAULT_CROP = { unit: '%', x: 10, y: 10, width: 80, height: 80 }
const DEMO_VIDEO_CROP = { unit: '%', x: 0, y: 35, width: 65, height: 65 }

export const useUploadState = ({ onUploadSuccess, onClearResult, setError }) => {
  const [inputType, setInputType] = useState('image')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [modelType, setModelType] = useState('')
  const [interval, setInterval] = useState(1)
  const [crop, setCrop] = useState(DEFAULT_CROP)
  const [frameUrl, setFrameUrl] = useState(null)
  const [videoDimensions, setVideoDimensions] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const clearPreviewUrl = () => {
    if (preview) URL.revokeObjectURL(preview)
  }

  const resetPreviewState = () => {
    clearPreviewUrl()
    setPreview(null)
    setFrameUrl(null)
    setVideoDimensions(null)
  }

  const handleInputTypeChange = (event) => {
    const nextType = event.target.value
    setInputType(nextType)
    setFile(null)
    resetPreviewState()
    setModelType('')
    setInterval(1)
    setCrop(DEFAULT_CROP)
    setError('')
    if (onClearResult) onClearResult()
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    clearPreviewUrl()
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setCrop(DEFAULT_CROP)
    setFrameUrl(null)
    setVideoDimensions(null)
    setError('')
    if (onClearResult) onClearResult()
  }

  const handleDemoSelected = ({ file: demoFile, inputType: demoInputType }) => {
    clearPreviewUrl()
    setInputType(demoInputType)
    setFile(demoFile)
    setPreview(URL.createObjectURL(demoFile))
    setFrameUrl(null)
    setVideoDimensions(null)
    setError('')
    setModelType('yolo')
    if (onClearResult) onClearResult()
    if (demoInputType === 'video') {
      setInterval(3.5)
      setCrop(DEMO_VIDEO_CROP)
    } else {
      setInterval(1)
      setCrop(DEFAULT_CROP)
    }
  }

  const handleFrameCapture = useCallback((frameDataUrl, width, height) => {
    setFrameUrl(frameDataUrl)
    setVideoDimensions({ width, height })
  }, [])

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
    if (!file) return setError('Please select a file or use a demo sample.')
    if (!modelType) return setError('Please select a model.')
    if (inputType === 'video' && !frameUrl) return setError('Please wait for the video preview to load.')
    if (inputType === 'video' && !getVideoCropCoordinates()) return setError('Please select a valid crop region.')

    setSubmitting(true)
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
      const errorMsg = typeof error === 'string' ? error : error?.error || error?.detail || error?.message || JSON.stringify(error)
      setError(`Upload failed: ${errorMsg}`)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    inputType, file, preview, modelType, interval, crop, frameUrl, submitting,
    handleInputTypeChange, handleFileChange, handleDemoSelected, handleFrameCapture, handleSubmit, setModelType, setInterval, setCrop
  }
}
