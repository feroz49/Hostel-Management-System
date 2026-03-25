import api, { STORAGE_KEYS, clearStoredSession } from './api'

const persistSession = (payload) => {
  if (payload?.token) {
    localStorage.setItem(STORAGE_KEYS.token, payload.token)
  }

  if (payload?.user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(payload.user))
  }
}

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    persistSession(response.data)
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    persistSession(response.data)
    return response.data
  },

  logout: () => {
    clearStoredSession()
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  getStoredUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.user)
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.token)
  }
}

export default authService
