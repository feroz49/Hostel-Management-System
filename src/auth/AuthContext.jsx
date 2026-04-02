import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api, { STORAGE_KEYS, clearStoredSession } from '../services/api'

const AuthContext = createContext(null)

const normalizeRole = (role) => role === 'Student' ? 'Student' : 'Admin'

export const getSessionTypeForRole = (role) => normalizeRole(role) === 'Student' ? 'student' : 'admin'
export const getLoginPathForRole = (role) => normalizeRole(role) === 'Student' ? '/student/login' : '/login'
export const getDashboardPathForRole = (role) => normalizeRole(role) === 'Student' ? '/student' : '/admin'
export const getAuthBasePathForRole = (role) => normalizeRole(role) === 'Student' ? '/student-auth' : '/auth'

const persistSession = (token, user, sessionType = getSessionTypeForRole(user?.role)) => {
  localStorage.setItem(STORAGE_KEYS.token, token)
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
  localStorage.setItem(STORAGE_KEYS.sessionType, sessionType)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    const storedUser = localStorage.getItem(STORAGE_KEYS.user)
    const storedSessionType = localStorage.getItem(STORAGE_KEYS.sessionType)

    if (!token) {
      setLoading(false)
      return
    }

    let initialRole = storedSessionType === 'student' ? 'Student' : 'Admin'

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        initialRole = normalizeRole(parsedUser?.role || initialRole)
        setUser(parsedUser)
      } catch (error) {
        clearStoredSession()
        setLoading(false)
        return
      }
    }

    let active = true
    const mePath = `${getAuthBasePathForRole(initialRole)}/me`

    api.get(mePath)
      .then(({ data }) => {
        if (!active) return
        persistSession(token, data)
        setUser(data)
      })
      .catch(() => {
        if (!active) return
        clearStoredSession()
        setUser(null)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const login = async (email, password, role = 'Admin') => {
    const normalizedRole = normalizeRole(role)
    const { data } = await api.post(`${getAuthBasePathForRole(normalizedRole)}/login`, { email, password })
    persistSession(data.token, data.user, getSessionTypeForRole(normalizedRole))
    setUser(data.user)
    return data
  }

  const register = async (payload, role = 'Admin') => {
    const normalizedRole = normalizeRole(role)
    const { data } = await api.post(`${getAuthBasePathForRole(normalizedRole)}/register`, payload)
    persistSession(data.token, data.user, getSessionTypeForRole(normalizedRole))
    setUser(data.user)
    return data
  }

  const logout = () => {
    clearStoredSession()
    setUser(null)
  }

  const updateProfile = async ({ name, phoneNumber, guardianContact }) => {
    const role = normalizeRole(user?.role)
    const { data } = await api.put(`${getAuthBasePathForRole(role)}/me`, {
      name,
      phoneNumber,
      guardianContact,
    })
    const nextUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      guardianContact: data.guardianContact || null,
      roomId: data.roomId || null,
      role: data.role,
      lastLogin: data.lastLogin,
    }
    const token = localStorage.getItem(STORAGE_KEYS.token)

    if (token) {
      persistSession(token, nextUser)
    }

    setUser(nextUser)
    return data
  }

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    updateProfile,
    logout,
    dashboardPath: getDashboardPathForRole(user?.role),
    loginPath: getLoginPathForRole(user?.role),
    isAuthenticated: Boolean(user)
  }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
