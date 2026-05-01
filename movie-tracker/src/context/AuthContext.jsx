import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const HARDCODED_USER = { username: 'demo', password: 'demo123' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('reelwatch_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (username, password) => {
    if (username === HARDCODED_USER.username && password === HARDCODED_USER.password) {
      const userData = { username }
      setUser(userData)
      localStorage.setItem('reelwatch_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials. Try demo / demo123' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('reelwatch_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
