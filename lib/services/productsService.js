// ¿Por qué un service separado?
// - Centraliza toda la lógica de base de datos
// - Reutilizable en múltiples componentes
// - Fácil de testear y mantener
import { supabase } from '../supabase'

export const productsService = {
  // Obtener todos los productos del usuario
  async getProducts(userId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(error.message)
    return data
  },

  // Crear un nuevo producto
  async createProduct(productData, userId) {
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...productData, user_id: userId }])
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // Actualizar un producto existente
  async updateProduct(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // Eliminar un producto
  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(error.message)
    return true
  },

  // Obtener un producto por ID
  async getProduct(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // Buscar productos por nombre o categoría
  async searchProducts(query, userId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(error.message)
    return data
  }
}