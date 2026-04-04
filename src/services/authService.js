import api, { STORAGE_KEYS, clearStoredSession } from './api'

const getSessionTypeForRole = (role) => role === 'Student' ? 'student' : 'admin'
const getAuthBasePathForRole = (role) => role === 'Student' ? '/student-auth' : '/auth'

const persistSession = (payload, role = payload?.user?.role) => {
  if (payload?.token) {
    localStorage.setItem(STORAGE_KEYS.token, payload.token)
  }

  if (payload?.user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(payload.user))
  }

  if (role) {
    localStorage.setItem(STORAGE_KEYS.sessionType, getSessionTypeForRole(role))
  }
}

export const authService = {
  login: async (email, password, role = 'Admin') => {
    const response = await api.post(`${getAuthBasePathForRole(role)}/login`, { email, password })
    persistSession(response.data, role)
    return response.data
  },

  register: async (userData, role = 'Admin') => {
    const response = await api.post(`${getAuthBasePathForRole(role)}/register`, userData)
    persistSession(response.data, role)
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
