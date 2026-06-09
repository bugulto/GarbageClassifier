import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export const getJobs = async (filters = {}) => {
  const response = await axios.get(`${API_BASE_URL}/results/jobs/`, {
    params: filters,
  })

  return response.data
}

export const getJobDetail = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/results/jobs/${jobId}/`)
  return response.data
}