// ¿Por qué un componente Button personalizado?
// Mantiene consistencia visual y facilita cambios de diseño globales
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-indigo-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `.trim()

  return (
    <button 
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Procesando...' : children}
    </button>
  )
}