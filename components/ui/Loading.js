// ¿Por qué un Loading component?
// - Consistencia visual en toda la app
// - Fácil cambiar el diseño del loading globalmente
export default function Loading({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizes[size]}`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  )
}