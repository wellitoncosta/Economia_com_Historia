'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { clearSession, getStoredToken, getStoredUser, storeSession, storeUser } from '@/lib/auth'
import type { AuthResponse, Role, Utilizador } from '@/lib/types'

interface AuthContextType {
  user: Utilizador | null
  role: Role | undefined
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (data: { email: string; password: string; regiao?: string; instituicao?: string }) => Promise<AuthResponse>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: undefined,
  loading: true,
  login: async () => {
    throw new Error('AuthProvider indisponivel.')
  },
  register: async () => {
    throw new Error('AuthProvider indisponivel.')
  },
  logout: () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<Utilizador | null>(() => getStoredUser())
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const token = getStoredToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const me = await api.me(token)
      setUser(me)
      storeUser(me)
    } catch {
      clearSession()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password })
    storeSession(response.token, response.utilizador)
    setUser(response.utilizador)
    return response
  }

  const register = async (data: { email: string; password: string; regiao?: string; instituicao?: string }) => {
    const response = await api.register(data)
    storeSession(response.token, response.utilizador)
    setUser(response.utilizador)
    return response
  }

  const logout = () => {
    clearSession()
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
