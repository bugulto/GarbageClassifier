import axios from 'axios'
import { API_BASE_URL } from './apiConfig'

export const askQuestion = async (question, jobId = null) => {
  const payload = {
    question,
  }

  if (jobId) {
    payload.job_id = jobId
  }

  const response = await axios.post(`${API_BASE_URL}/chat/`, payload)

  return {
    role: 'assistant',
    content: response.data.answer,
  }
}