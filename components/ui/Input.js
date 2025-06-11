// ¿Por qué un componente Input personalizado?
// Estandariza estilos y validaciones en toda la app
export default function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}) {
  const inputClasses = `
    appearance-none relative block w-full px-3 py-2 border 
    ${error ? 'border-red-300' : 'border-gray-300'} 
    placeholder-gray-500 text-gray-900 rounded-md 
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
    focus:z-10 sm:text-sm ${className}
  `.trim()

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}