// ¿Por qué ProductCard separado?
// - Componente reutilizable para mostrar productos
// - Fácil de mantener y modificar visualmente
// - Acciones (editar, eliminar) centralizadas
import { useState } from 'react'
import Button from '../ui/Button'

export default function ProductCard({ product, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }
    
    setIsDeleting(true)
    await onDelete(product.id)
    setIsDeleting(false)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          {product.category && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
              {product.category}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-600">{formatPrice(product.price)}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        </div>
      </div>

      {/* Descripción */}
      {product.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Creado: {formatDate(product.created_at)}
        </span>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={isDeleting}
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}