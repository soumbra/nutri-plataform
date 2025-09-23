'use client'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    )
  }

  if (user) {
    // Se logado, mostrar dashboard baseado no role
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">
          Bem-vindo, {user.name}!
        </h1>
        <p>Role: {user.role}</p>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Ir para Dashboard
        </Button>
      </div>
    )
  }

  // Se não logado, mostrar landing page
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Nutri Platform
      </h1>
      <p className="text-center text-muted-foreground mb-12 text-lg">
        Conectando clientes e nutricionistas para uma vida mais saudável
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Para Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Encontre o nutricionista ideal e acompanhe seu progresso
            </p>
            <Link href="/login?role=client">
              <Button className="w-full" size="lg">
                Começar como Cliente
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Para Nutricionistas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gerencie seus clientes e crie planos personalizados
            </p>
            <Link href="/login?role=nutritionist">
              <Button variant="outline" className="w-full" size="lg">
                Começar como Nutricionista
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}