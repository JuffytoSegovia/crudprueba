'use client'

import { useAuth } from '../../lib/hooks/useAuth'
import ProtectedRoute from '../../components/layout/ProtectedRoute'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Bienvenido, {user?.email}</p>
              </div>
              <button
                onClick={signOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cerrar Sesión
              </button>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-500">CRUD de productos próximamente...</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}