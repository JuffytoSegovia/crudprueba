'use client'

import { useState } from 'react'
import { useFiles } from '../../lib/hooks/useFiles'
import FileDropzone from './FileDropzone'
import FileList from './FileList'
import { MAX_FILES_PER_PRODUCT } from '../../lib/constants/fileTypes'

export default function FileUpload({ productId }) {
  const { 
    files, 
    loading, 
    uploading, 
    error, 
    uploadMultipleFiles, 
    deleteFile 
  } = useFiles(productId)
  
  const [uploadResults, setUploadResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const handleFilesSelected = async (selectedFiles) => {
    // Validar que tenemos archivos
    if (!selectedFiles || selectedFiles.length === 0) {
      return
    }

    if (files.length + selectedFiles.length > MAX_FILES_PER_PRODUCT) {
      alert(`Máximo ${MAX_FILES_PER_PRODUCT} archivos por producto`)
      return
    }

    try {
      const results = await uploadMultipleFiles(selectedFiles)
      
      // CORREGIDO: Validar que results es un array
      if (Array.isArray(results)) {
        setUploadResults(results)
        setShowResults(true)
        
        // Ocultar resultados después de 5 segundos
        setTimeout(() => {
          setShowResults(false)
          setUploadResults([])
        }, 5000)
      }
    } catch (err) {
      console.error('Error uploading files:', err)
    }
  }

  // AGREGAR: Validación temprana
  if (!productId) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-gray-400 text-4xl mb-4">📎</div>
        <p className="text-gray-600">
          Producto no disponible para subir archivos
        </p>
      </div>
    )
  }

  const remainingSlots = MAX_FILES_PER_PRODUCT - files.length

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      {remainingSlots > 0 && (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          maxFiles={remainingSlots}
          disabled={uploading}
        />
      )}
      
      {/* Límite de archivos */}
      <div className="text-center text-sm text-gray-500">
        {files.length} de {MAX_FILES_PER_PRODUCT} archivos utilizados
        {remainingSlots === 0 && (
          <span className="text-amber-600 font-medium"> (límite alcanzado)</span>
        )}
      </div>

      {/* Indicador de subida */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800">Subiendo archivos...</span>
          </div>
        </div>
      )}

      {/* Resultados de upload */}
      {showResults && Array.isArray(uploadResults) && uploadResults.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Resultados de subida:</h4>
          <div className="space-y-2">
            {uploadResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 text-sm ${
                  result.success ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <span>{result.success ? '✅' : '❌'}</span>
                <span className="font-medium">{result.file}</span>
                {result.error && (
                  <span className="text-gray-500">- {result.error}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error general */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">
            ⚠️ Error: {error}
          </div>
        </div>
      )}

      {/* Lista de archivos */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">
          Archivos adjuntos ({files.length})
        </h4>
        <FileList
          files={files}
          onDelete={deleteFile}
          loading={loading}
        />
      </div>
    </div>
  )
}