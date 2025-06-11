// ¿Por qué definir tipos permitidos?
// - Seguridad: prevenir archivos maliciosos
// - UX: mostrar extensiones válidas al usuario
// - Validación: verificar antes de subir
export const ALLOWED_FILE_TYPES = {
  // Imágenes
  'image/jpeg': { ext: '.jpg', category: 'image', icon: '🖼️' },
  'image/png': { ext: '.png', category: 'image', icon: '🖼️' },
  'image/gif': { ext: '.gif', category: 'image', icon: '🖼️' },
  'image/webp': { ext: '.webp', category: 'image', icon: '🖼️' },
  
  // Documentos
  'application/pdf': { ext: '.pdf', category: 'document', icon: '📄' },
  'application/msword': { ext: '.doc', category: 'document', icon: '📝' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: '.docx', category: 'document', icon: '📝' },
  'application/vnd.ms-excel': { ext: '.xls', category: 'spreadsheet', icon: '📊' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: '.xlsx', category: 'spreadsheet', icon: '📊' },
  'text/plain': { ext: '.txt', category: 'text', icon: '📋' },
  'text/csv': { ext: '.csv', category: 'spreadsheet', icon: '📊' }
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_FILES_PER_PRODUCT = 5

export const FILE_CATEGORIES = {
  image: { name: 'Imágenes', color: 'blue' },
  document: { name: 'Documentos', color: 'green' },
  spreadsheet: { name: 'Hojas de cálculo', color: 'yellow' },
  text: { name: 'Texto', color: 'gray' }
}

export function getFileTypeInfo(mimeType) {
  return ALLOWED_FILE_TYPES[mimeType] || { ext: '', category: 'unknown', icon: '📎' }
}

export function isFileTypeAllowed(mimeType) {
  return mimeType in ALLOWED_FILE_TYPES
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}