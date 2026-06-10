import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

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