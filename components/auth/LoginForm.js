// ¿Por qué separar LoginForm?
// Componentes pequeños son más fáciles de mantener y testear
'use client'

import { useState } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function LoginForm({ onToggleMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await signIn(email, password)
    setMessage(result.message)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <Input
        label="Contraseña"
        type="password"
        required
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {message && (
        <div className={`text-sm text-center ${
          message.includes('exitoso') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        Iniciar Sesión
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-indigo-600 hover:text-indigo-500 text-sm"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </form>
  )
}