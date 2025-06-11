// ¿Por qué todo en el dashboard?
// - Página principal donde los usuarios gestionan productos
// - Integra todos los componentes de productos
// - Maneja el estado general de la aplicación CRUD
'use client'

import { useState } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import { useProducts } from '../../lib/hooks/useProducts'
import ProtectedRoute from '../../components/layout/ProtectedRoute'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ProductForm from '../../components/products/ProductForm'
import ProductList from '../../components/products/ProductList'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    searchProducts,
    refetch 
  } = useProducts()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState('')

  const openCreateModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setMessage('')
  }

  const handleSubmit = async (productData) => {
    setFormLoading(true)
    setMessage('')

    try {
      let result
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData)
      } else {
        result = await createProduct(productData)
      }

      if (result.success) {
        setMessage(`Producto ${editingProduct ? 'actualizado' : 'creado'} exitosamente`)
        setTimeout(() => {
          closeModal()
        }, 1500)
      } else {
        setMessage(result.error)
      }
    } catch (err) {
      setMessage('Error inesperado')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    const result = await deleteProduct(productId)
    if (!result.success) {
      alert('Error al eliminar el producto: ' + result.error)
    }
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      searchProducts(query)
    } else {
      refetch()
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard de Productos
                </h1>
                <p className="text-gray-600">
                  Bienvenido, {user?.email}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button onClick={openCreateModal}>
                  ➕ Nuevo Producto
                </Button>
                <Button
                  variant="danger"
                  onClick={signOut}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-red-800">
                ⚠️ Error: {error}
              </div>
            </div>
          )}

          <ProductList
            products={products}
            loading={loading}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onSearch={handleSearch}
            onRefresh={refetch}
          />
        </div>

        {/* Modal de formulario */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          size="lg"
        >
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            loading={formLoading}
          />
          
          {message && (
            <div className={`mt-4 text-sm text-center ${
              message.includes('exitosamente') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  )
}