// ¿Por qué un service de archivos?
// - Centraliza todas las operaciones de Storage
// - Maneja tanto Supabase Storage como la tabla product_files
// - Genera nombres únicos y seguros para archivos
import { supabase } from '../supabase'
import { isFileTypeAllowed, MAX_FILE_SIZE } from '../constants/fileTypes'

export const filesService = {
  // Subir archivo a Storage y registrar en BD
  async uploadFile(file, productId, userId) {
    // Validaciones
    if (!isFileTypeAllowed(file.type)) {
      throw new Error(`Tipo de archivo no permitido: ${file.type}`)
    }
    
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Archivo muy grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    // Generar nombre único
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${userId}/${productId}/${fileName}`

    try {
      // Subir a Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-files')
        .getPublicUrl(filePath)

      // Registrar en base de datos
      const { data: fileRecord, error: dbError } = await supabase
        .from('product_files')
        .insert([{
          product_id: productId,
          file_name: fileName,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          original_name: file.name,
          user_id: userId
        }])
        .select()
        .single()

      if (dbError) {
        // Si falla la BD, eliminar archivo del storage
        await supabase.storage.from('product-files').remove([filePath])
        throw dbError
      }

      return {
        ...fileRecord,
        public_url: publicUrl
      }
    } catch (error) {
      throw new Error(`Error al subir archivo: ${error.message}`)
    }
  },

  // Obtener archivos de un producto
  async getProductFiles(productId) {
    const { data, error } = await supabase
      .from('product_files')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    // Agregar URLs públicas
    return data.map(file => ({
      ...file,
      public_url: supabase.storage.from('product-files').getPublicUrl(file.file_path).data.publicUrl
    }))
  },

  // Eliminar archivo
  async deleteFile(fileId) {
    try {
      // Obtener info del archivo
      const { data: fileInfo, error: fetchError } = await supabase
        .from('product_files')
        .select('file_path')
        .eq('id', fileId)
        .single()

      if (fetchError) throw fetchError

      // Eliminar de Storage
      const { error: storageError } = await supabase.storage
        .from('product-files')
        .remove([fileInfo.file_path])

      if (storageError) throw storageError

      // Eliminar registro de BD
      const { error: dbError } = await supabase
        .from('product_files')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      return true
    } catch (error) {
      throw new Error(`Error al eliminar archivo: ${error.message}`)
    }
  },

  // Obtener todos los archivos del usuario
  async getUserFiles(userId) {
    const { data, error } = await supabase
      .from('product_files')
      .select(`
        *,
        products(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return data.map(file => ({
      ...file,
      public_url: supabase.storage.from('product-files').getPublicUrl(file.file_path).data.publicUrl
    }))
  },

  // Validar archivo antes de subir
  validateFile(file) {
    const errors = []
    
    if (!isFileTypeAllowed(file.type)) {
      errors.push(`Tipo de archivo no permitido: ${file.type}`)
    }
    
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`Archivo muy grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }
    
    if (file.size === 0) {
      errors.push('El archivo está vacío')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}