// ¿Por qué un service?
// Separa la lógica de API de los componentes UI, más mantenible
import { supabase } from '../supabase'

export const authService = {
  // Login de usuario
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw new Error(error.message)
    return data
  },

  // Registro de usuario
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw new Error(error.message)
    return data
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)
    return user
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}