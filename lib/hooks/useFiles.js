'use client'

import { useState, useEffect, useCallback } from 'react'
import { filesService } from '../services/filesService'
import { useAuth } from './useAuth'

export function useFiles(productId = null) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // fetchFiles se memoiza → useEffect solo se ejecuta cuando cambian las dependencias reales
  const fetchFiles = useCallback(async () => {
    if (!productId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await filesService.getProductFiles(productId)
      setFiles(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }, [productId])

  // Cargar archivos cuando cambia el productId
  useEffect(() => {
    if (productId && user) {
      fetchFiles() // Esta función es estable
    }
  }, [productId, user, fetchFiles]) // fetchFiles es estable

  const uploadFile = async (file) => {
    if (!productId || !user) {
      throw new Error('Producto o usuario no disponible')
    }

    // Validar archivo
    const validation = filesService.validateFile(file)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    try {
      setError(null)
      
      const uploadedFile = await filesService.uploadFile(file, productId, user.id)
      setFiles(prev => [uploadedFile, ...prev])
      
      return { success: true, file: uploadedFile }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const deleteFile = async (fileId) => {
    try {
      await filesService.deleteFile(fileId)
      setFiles(prev => prev.filter(file => file.id !== fileId))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // CORREGIDO: uploadMultipleFiles mejorado
  const uploadMultipleFiles = async (fileList) => {
    const results = []
    setUploading(true)
    setError(null)
    
    try {
      for (const file of fileList) {
        try {
          const result = await uploadFile(file)
          results.push({ 
            file: file.name, 
            success: result.success,
            error: result.error || null
          })
        } catch (err) {
          results.push({ 
            file: file.name, 
            success: false, 
            error: err.message 
          })
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
    
    return results
  }

  return {
    files,
    loading,
    uploading,
    error,
    fetchFiles,
    uploadFile,
    deleteFile,
    uploadMultipleFiles,
    refetch: fetchFiles
  }
}