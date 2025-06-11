// ¿Por qué separar RegisterForm de LoginForm?
// - Validaciones diferentes (confirmar contraseña, formato email)
// - Mensajes específicos de registro
// - Lógica de UI distinta (términos, confirmaciones)
'use client'

import { useState } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function RegisterForm({ onToggleMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { signUp } = useAuth()

  const validateForm = () => {
    const newErrors = {}
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }
    
    // Validar contraseña (mínimo 6 caracteres)
    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    
    if (!validateForm()) return
    
    setLoading(true)
    
    const result = await signUp(formData.email, formData.password)
    setMessage(result.message)
    
    // Si el registro fue exitoso, limpiar formulario
    if (result.success) {
      setFormData({ email: '', password: '', confirmPassword: '' })
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        name="email"
        required
        placeholder="tu@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      
      <Input
        label="Contraseña"
        type="password"
        name="password"
        required
        placeholder="Mínimo 6 caracteres"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      
      <Input
        label="Confirmar Contraseña"
        type="password"
        name="confirmPassword"
        required
        placeholder="Repite tu contraseña"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      {message && (
        <div className={`text-sm text-center ${
          message.includes('creada') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        Crear Cuenta
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-indigo-600 hover:text-indigo-500 text-sm"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </form>
  )
}