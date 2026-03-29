import axios from 'axios'

export const STORAGE_KEYS = {
  token: 'authToken',
  user: 'authUser'
}

export const clearStoredSession = () => {
  localStorage.removeItem(STORAGE_KEYS.token)
  localStorage.removeItem(STORAGE_KEYS.user)
}

const getDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api'
  }

  const { protocol, hostname } = window.location
  return `${protocol}//${hostname}:5000/api`
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiBaseUrl()

export const getApiOrigin = () => {
  return API_BASE_URL.replace(/\/api\/?$/, '')
}

export const getApiErrorMessage = (error, fallbackMessage = 'Something went wrong.') => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    return `Network Error: Unable to connect to ${getApiOrigin()}. Please make sure the backend server is running.`
  }

  return error?.message || fallbackMessage
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasStoredSession = Boolean(localStorage.getItem(STORAGE_KEYS.token))
    const shouldRedirect =
      (error.response?.status === 401 || error.response?.status === 403) &&
      hasStoredSession &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/login')

    if (shouldRedirect) {
      clearStoredSession()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
