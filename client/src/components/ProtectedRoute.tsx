'use client'

import { ReactNode } from 'react'
import { useRequireRole } from '@/hooks/useAuth'
import { User } from '@/types/auth'
import { Card, CardContent } from '@/components/ui/card'

interface ProtectedRouteProps {
  readonly children: ReactNode
  readonly requiredRole: User['role']
  readonly fallback?: ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthorized, loading } = useRequireRole(requiredRole)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Verificando permissões...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthorized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta área.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Componentes específicos para cada role
export function NutritionistRoute({ children, fallback }: { 
  readonly children: ReactNode
  readonly fallback?: ReactNode 
}) {
  return (
    <ProtectedRoute requiredRole="NUTRITIONIST" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function ClientRoute({ children, fallback }: { 
  readonly children: ReactNode
  readonly fallback?: ReactNode 
}) {
  return (
    <ProtectedRoute requiredRole="CLIENT" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function AdminRoute({ children, fallback }: { 
  readonly children: ReactNode
  readonly fallback?: ReactNode 
}) {
  return (
    <ProtectedRoute requiredRole="ADMIN" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}