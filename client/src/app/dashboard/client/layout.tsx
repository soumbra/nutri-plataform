import { ReactNode } from 'react'
import { ClientRoute } from '@/components/ProtectedRoute'

interface ClientLayoutProps {
  readonly children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ClientRoute>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ClientRoute>
  )
}