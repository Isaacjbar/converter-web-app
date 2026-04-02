import axios from 'axios'
import { encryptPayload, decryptPayload } from './utils/crypto'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

// Auth interceptor — adds Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Encryption interceptor — encrypts JSON body (skips FormData / GET)
api.interceptors.request.use(async (config) => {
  if (
    config.data &&
    !(config.data instanceof FormData) &&
    config.method !== 'get'
  ) {
    const encrypted = await encryptPayload(config.data)
    config.data = encrypted
    config.headers['X-Encrypted'] = 'true'
    config.headers['Content-Type'] = 'text/plain'
  }
  return config
})

// Response interceptor — decrypts encrypted responses + handles 401 refresh
api.interceptors.response.use(
  async (response) => {
    if (response.headers['x-encrypted'] === 'true' && response.data?.data) {
      response.data = await decryptPayload(response.data.data)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || ''}/auth/refresh/`,
            { refresh }
          )
          localStorage.setItem('access_token', data.access)
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          return api(originalRequest)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
