'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ClientContracts from '@/components/ClientContracts'

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Olá, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Você está logado como {user.role === 'CLIENT' ? 'Cliente' : 'Nutricionista'}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Sair
        </Button>
      </div>

      {user.role === 'CLIENT' ? (
        <div className="grid gap-6">
          {/* Contratos Ativos */}
          <ClientContracts />
          
          <Card>
            <CardHeader>
              <CardTitle>Encontrar Nutricionista</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Procure o profissional ideal para seus objetivos
              </p>
              <Link href="/nutritionists">
                <Button>Buscar Nutricionistas</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meu Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Acompanhe sua evolução e planos alimentares
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gerencie seus clientes e acompanhamentos
              </p>
              <Button>Ver Clientes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planos Alimentares</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Crie e edite planos personalizados
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}