// ¿Por qué un componente ProductForm separado?
// - Reutilizable para crear Y editar productos
// - Validaciones centralizadas
// - Lógica de formulario aislada
'use client'

import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function ProductForm({ 
  product = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '0'
  })
  const [errors, setErrors] = useState({})

  // Si hay un producto (modo edición), llenar el formulario
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        category: product.category || '',
        stock: product.stock?.toString() || '0'
      })
    }
  }, [product])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }
    
    if (formData.stock && parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo cuando el usuario escriba
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Convertir tipos de datos
    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      category: formData.category.trim(),
      stock: parseInt(formData.stock) || 0
    }
    
    onSubmit(productData)
  }

  const isEditing = !!product

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre del producto *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Ej: iPhone 15"
        />
        
        <Input
          label="Precio *"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="0.00"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          placeholder="Ej: Electrónicos"
        />
        
        <Input
          label="Stock"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          error={errors.stock}
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe tu producto..."
        />
      </div>

      <div className="flex space-x-4">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
        >
          {isEditing ? 'Actualizar' : 'Crear'} Producto
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}