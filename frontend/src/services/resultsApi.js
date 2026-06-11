import axios from 'axios'
import { API_BASE_URL } from './apiConfig'

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