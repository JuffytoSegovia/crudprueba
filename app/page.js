'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { APP_CONFIG } from '../lib/config'
import { ROUTES } from '../lib/constants/apiRoutes'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si el usuario ya está logueado, redirigir al dashboard
    if (user && !loading) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
            {APP_CONFIG.name}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {APP_CONFIG.description}
          </p>
        </div>
        
        <div className="mt-8">
          <Link
            href={ROUTES.AUTH}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Comenzar
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          <p>Funcionalidades:</p>
          <ul className="mt-2 space-y-1">
            <li>✓ Registro y login con email</li>
            <li>✓ CRUD completo de productos</li>
            <li>✓ Base de datos SQL en la nube</li>
            <li>✓ Desplegado en Vercel</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
