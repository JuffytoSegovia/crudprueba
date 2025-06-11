import './globals.css'
import { AuthProvider } from '../lib/hooks/useAuth'

export const metadata = {
  title: 'CRUD App - Vercel',
  description: 'Aplicación CRUD con React, Next.js y Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
