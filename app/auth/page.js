// ¿Por qué una página que alterna?
// - Mejor UX: usuario no navega entre páginas
// - Mantiene el estado y contexto
// - Diseño más moderno y fluido
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import LoginForm from '../../components/auth/LoginForm'
import RegisterForm from '../../components/auth/RegisterForm'
import { APP_CONFIG } from '../../lib/config'
import { ROUTES } from '../../lib/constants/apiRoutes'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si el usuario ya está logueado, redirigir al dashboard
    if (user && !loading) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [user, loading, router])

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Verificando sesión...</div>
      </div>
    )
  }

  // Si ya está logueado, no mostrar formulario
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {APP_CONFIG.name}
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin 
              ? 'Accede a tu cuenta para continuar' 
              : 'Regístrate para comenzar a usar la aplicación'
            }
          </p>
        </div>

        {/* Formularios */}
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer informativo */}
        <div className="text-center text-xs text-gray-500">
          <p>Al registrarte, aceptas nuestros términos de servicio</p>
          <p className="mt-1">Desarrollado con Next.js y Supabase</p>
        </div>
      </div>
    </div>
  )
}