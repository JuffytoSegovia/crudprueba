// ¿Por qué FileList separado?
// - Muestra archivos organizados con metadata
// - Acciones rápidas (ver, descargar, eliminar)
// - Diferentes vistas según tipo de archivo
import { useState } from 'react'
import { formatFileSize, getFileTypeInfo } from '../../lib/constants/fileTypes'
import Button from '../ui/Button'
import Image from 'next/image'

export default function FileList({ files, onDelete, loading = false }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (fileId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      return
    }
    
    setDeletingId(fileId)
    await onDelete(fileId)
    setDeletingId(null)
  }

  const handleDownload = (file) => {
    window.open(file.public_url, '_blank')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-4">📎</div>
        <p className="text-gray-500">No hay archivos adjuntos</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {files.map((file) => {
        const fileInfo = getFileTypeInfo(file.file_type)
        const isImage = file.file_type.startsWith('image/')
        
        return (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center space-x-4 flex-1">
              {/* Preview o icono */}
              <div className="flex-shrink-0">
                {isImage ? (
                  <Image
                    src={file.public_url}
                    alt={file.original_name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className={`w-12 h-12 flex items-center justify-center text-2xl ${isImage ? 'hidden' : ''}`}
                >
                  {fileInfo.icon}
                </div>
              </div>
              
              {/* Info del archivo */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.original_name}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{formatFileSize(file.file_size)}</span>
                  <span>•</span>
                  <span>{formatDate(file.created_at)}</span>
                  <span>•</span>
                  <span className="capitalize">{fileInfo.category}</span>
                </div>
              </div>
            </div>
            
            {/* Acciones */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(file)}
                title="Ver/Descargar archivo"
              >
                👁️
              </Button>
              
              <Button
                variant="danger"
                size="sm"
                loading={deletingId === file.id}
                onClick={() => handleDelete(file.id)}
                title="Eliminar archivo"
              >
                🗑️
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}