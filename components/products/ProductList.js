// ¿Por qué ProductList separado?
// - Maneja el estado de múltiples productos
// - Incluye funcionalidades de búsqueda y filtrado
// - Organiza la visualización en grid/lista
import { useState } from 'react'
import ProductCard from './ProductCard'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function ProductList({ 
  products, 
  loading, 
  onEdit, 
  onDelete, 
  onSearch,
  onRefresh 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' o 'list'

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
    onSearch('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={handleSearch}
              className="pr-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
          >
            🔄 Actualizar
          </Button>
          
          {/* Toggle de vista */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded-l-md ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📱 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-r-md ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📋 Lista
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-blue-800 font-medium">
            📊 Total de productos: {products.length}
          </span>
          {searchQuery && (
            <span className="text-blue-600 text-sm">
              Filtrando por: "{searchQuery}"
            </span>
          )}
        </div>
      </div>

      {/* Lista de productos */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No se encontraron productos' : 'No hay productos aún'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Crea tu primer producto para comenzar'
            }
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
