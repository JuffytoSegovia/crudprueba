// ¿Por qué este archivo?
// Centraliza configuración para fácil mantenimiento
export const APP_CONFIG = {
  name: 'CRUD App',
  description: 'Aplicación CRUD con React, Next.js y Supabase',
  version: '1.0.0'
}

export const FILE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx']
}

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}