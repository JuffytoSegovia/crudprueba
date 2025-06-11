// ¿Por qué un Dropzone?
// - Mejor UX: arrastrar y soltar archivos
// - Visual feedback durante drag
// - Validación visual antes de subir
'use client'

import { useState, useRef } from 'react'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, formatFileSize } from '../../lib/constants/fileTypes'

export default function FileDropzone({ 
  onFilesSelected, 
  maxFiles = 5, 
  disabled = false 
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
    
    // Limpiar input para permitir seleccionar el mismo archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFiles = (files) => {
    if (files.length === 0) return
    
    // Limitar número de archivos
    const filesToUpload = files.slice(0, maxFiles)
    
    onFilesSelected(filesToUpload)
  }

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const allowedExtensions = Object.values(ALLOWED_FILE_TYPES)
    .map(type => type.ext)
    .join(', ')

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragOver 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-300 hover:border-gray-400'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-50' 
          : 'cursor-pointer hover:bg-gray-50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
        accept={Object.keys(ALLOWED_FILE_TYPES).join(',')}
        disabled={disabled}
      />
      
      <div className="space-y-4">
        <div className="text-4xl">
          {isDragOver ? '⬇️' : '📁'}
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-900">
            {isDragOver 
              ? 'Suelta los archivos aquí' 
              : 'Arrastra archivos aquí o haz clic para seleccionar'
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Máximo {maxFiles} archivos, hasta {formatFileSize(MAX_FILE_SIZE)} cada uno
          </p>
        </div>
        
        <div className="text-xs text-gray-400">
          <p>Tipos permitidos:</p>
          <p>{allowedExtensions}</p>
        </div>
      </div>
      
      {disabled && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center rounded-lg">
          <span className="text-gray-500 font-medium">Subiendo archivos...</span>
        </div>
      )}
    </div>
  )
}