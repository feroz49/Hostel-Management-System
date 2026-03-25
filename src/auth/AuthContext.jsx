import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api, { STORAGE_KEYS, clearStoredSession } from '../services/api'

const AuthContext = createContext(null)

const persistSession = (token, user) => {
  localStorage.setItem(STORAGE_KEYS.token, token)
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    const storedUser = localStorage.getItem(STORAGE_KEYS.user)

    if (!token) {
      setLoading(false)
      return
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        clearStoredSession()
      }
    }

    let active = true

    api.get('/auth/me')
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

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persistSession(data.token, data.user)
    setUser(data.user)
    return data
  }

  const register = async ({ email, password }) => {
    const { data } = await api.post('/auth/register', { email, password })
    persistSession(data.token, data.user)
    setUser(data.user)
    return data
  }

  const logout = () => {
    clearStoredSession()
    setUser(null)
  }

  const updateProfile = async ({ name, phoneNumber }) => {
    const { data } = await api.put('/auth/me', { name, phoneNumber })
    const nextUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
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
