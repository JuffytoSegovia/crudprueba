// ¿Por qué un hook personalizado?
// Reutiliza lógica de auth en múltiples componentes sin duplicar código
'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../services/authService'
import { AUTH_MESSAGES } from '../constants/messages'
import { ROUTES } from '../constants/apiRoutes'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar usuario al cargar
    getCurrentUser()
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const getCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser()
      setUser(user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      const data = await authService.signIn(email, password)
      router.push(ROUTES.DASHBOARD)
      return { success: true, message: AUTH_MESSAGES.LOGIN_SUCCESS }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const signUp = async (email, password) => {
    try {
      await authService.signUp(email, password)
      return { success: true, message: AUTH_MESSAGES.REGISTER_SUCCESS }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      router.push(ROUTES.HOME)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}