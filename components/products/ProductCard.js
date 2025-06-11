// ¿Por qué mostrar archivos en ProductCard?
// - Vista rápida de qué productos tienen documentos
// - Acceso directo a archivos desde la lista
// - Mejor información para el usuario
import { useState, useEffect } from 'react'
import { useFiles } from '../../lib/hooks/useFiles'
import { formatFileSize, getFileTypeInfo } from '../../lib/constants/fileTypes'
import Button from '../ui/Button'

export default function ProductCard({ product, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showFiles, setShowFiles] = useState(false)
  const { files, loading } = useFiles(product.id)

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

  const toggleFiles = () => {
    setShowFiles(!showFiles)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {product.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product.category}
              </span>
            )}
            {/* Indicador de archivos */}
            {files.length > 0 && (
              <button
                onClick={toggleFiles}
                className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
                title={`${files.length} archivo(s) adjunto(s)`}
              >
                📎 {files.length}
              </button>
            )}
          </div>
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

      {/* Lista de archivos (colapsible) */}
      {showFiles && files.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Archivos adjuntos:
          </h5>
          <div className="space-y-1">
            {files.slice(0, 3).map((file) => {
              const fileInfo = getFileTypeInfo(file.file_type)
              return (
                <div key={file.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span>{fileInfo.icon}</span>
                    <span className="truncate">{file.original_name}</span>
                  </div>
                  <button
                    onClick={() => window.open(file.public_url, '_blank')}
                    className="text-indigo-600 hover:text-indigo-800 ml-2"
                    title="Ver archivo"
                  >
                    👁️
                  </button>
                </div>
              )
            })}
            {files.length > 3 && (
              <div className="text-xs text-gray-500 text-center pt-1">
                +{files.length - 3} archivo(s) más...
              </div>
            )}
          </div>
        </div>
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