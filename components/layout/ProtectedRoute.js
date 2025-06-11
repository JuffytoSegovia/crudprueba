// ¿Por qué ProtectedRoute?
// - Centraliza la lógica de protección de rutas
// - Redirige automáticamente usuarios no autenticados
// - Evita duplicar verificaciones en cada página privada
'use client'

import { useEffect } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '../../lib/constants/apiRoutes'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si terminó de cargar y no hay usuario, redirigir a auth
    if (!loading && !user) {
      router.push(ROUTES.AUTH)
    }
  }, [user, loading, router])

  // Mostrar loading mientras verifica
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Si no hay usuario, no mostrar contenido (se está redirigiendo)
  if (!user) {
    return null
  }

  // Usuario autenticado, mostrar contenido protegido
  return children
}