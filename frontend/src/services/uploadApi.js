import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export const uploadImage = async (file, modelType) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('input_type', 'image')
  formData.append('model_type', modelType)

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/`, formData)
    console.log('Upload response:', response.data) // temporary log to check response data
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const uploadVideo = async (
  file,
  modelType,
  intervalSeconds,
  cropCoordinates,
) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('input_type', 'video')
  formData.append('model_type', modelType)
  formData.append('interval_seconds', intervalSeconds)

  if (cropCoordinates) {
    formData.append('crop_x', cropCoordinates.x)
    formData.append('crop_y', cropCoordinates.y)
    formData.append('crop_width', cropCoordinates.width)
    formData.append('crop_height', cropCoordinates.height)
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/`, formData)
    console.log('Upload response:', response.data) // temporary log to check response data
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}
