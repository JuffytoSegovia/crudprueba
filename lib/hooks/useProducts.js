// ¿Por qué un hook de productos?
// - Centraliza la lógica de estado de productos
// - Reutilizable en múltiples componentes
// - Maneja loading, errores y actualizaciones automáticas
'use client'

import { useState, useEffect, useCallback } from 'react' // Agregar useCallback
import { productsService } from '../services/productsService'
import { useAuth } from './useAuth'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchProducts = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getProducts(user.id)
      setProducts(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Cargar productos al inicializar
  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user, fetchProducts])

  const createProduct = async (productData) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    try {
      const newProduct = await productsService.createProduct(productData, user.id)
      setProducts(prev => [newProduct, ...prev])
      return { success: true, data: newProduct }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productsService.updateProduct(id, productData)
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      )
      return { success: true, data: updatedProduct }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteProduct = async (id) => {
    try {
      await productsService.deleteProduct(id)
      setProducts(prev => prev.filter(product => product.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const searchProducts = async (query) => {
    if (!user) return
    
    try {
      setLoading(true)
      const data = await productsService.searchProducts(query, user.id)
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    refetch: fetchProducts
  }
}