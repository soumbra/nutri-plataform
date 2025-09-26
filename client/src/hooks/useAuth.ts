'use client'

import { useAuth } from '@/contexts/AuthContext'
import { User } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Hook para verificar se o usuário tem o role necessário
export function useRequireRole(requiredRole: User['role']) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se ainda está carregando, aguarda
    if (loading) return

    // Se não está autenticado, redireciona para login
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Se não tem o role necessário, redireciona
    if (user?.role !== requiredRole) {
      // Redireciona para dashboard apropriado baseado no role
      switch (user?.role) {
        case 'CLIENT':
          router.push('/dashboard/client')
          break
        case 'NUTRITIONIST':
          router.push('/dashboard/nutritionist')
          break
        case 'ADMIN':
          router.push('/dashboard/admin')
          break
        default:
          router.push('/dashboard')
      }
    }
  }, [user, isAuthenticated, loading, requiredRole, router])

  return {
    user,
    isAuthorized: isAuthenticated && user?.role === requiredRole,
    loading
  }
}

// Hook específico para nutricionistas
export function useRequireNutritionist() {
  return useRequireRole('NUTRITIONIST')
}

// Hook específico para clientes
export function useRequireClient() {
  return useRequireRole('CLIENT')
}

// Hook para verificar se é admin
export function useRequireAdmin() {
  return useRequireRole('ADMIN')
}

// Hook para verificar múltiplos roles
export function useRequireRoles(allowedRoles: User['role'][]) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!user?.role || !allowedRoles.includes(user.role)) {
      router.push('/dashboard')
    }
  }, [user, isAuthenticated, loading, allowedRoles, router])

  return {
    user,
    isAuthorized: isAuthenticated && user?.role && allowedRoles.includes(user.role),
    loading
  }
}