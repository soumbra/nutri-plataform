'use client'
export const dynamic = 'force-dynamic';

import { useState, useMemo, Suspense } from 'react'
import { Calendar, Clock, User, ChevronLeft, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMealPlans } from '@/hooks/useMealPlans'
import type { MealPlanFilters, MealPlan } from '@/services/meal-plan.service'
import Link from 'next/link'

function ClientMealPlansContent() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  // Filtros para o hook
  const filters = useMemo<MealPlanFilters>(() => {
    let isActiveFilter: boolean | undefined
    if (selectedStatus === 'active') {
      isActiveFilter = true
    } else if (selectedStatus === 'inactive') {
      isActiveFilter = false
    }
    
    return {
      isActive: isActiveFilter
    }
  }, [selectedStatus])

  const { 
    mealPlans, 
    loading, 
    error 
  } = useMealPlans({
    initialFilters: filters,
    autoFetch: true
  })

  // Stats calculadas
  const stats = useMemo(() => {
    const total = mealPlans.length
    const active = mealPlans.filter(plan => plan.isActive).length
    const inactive = total - active
    
    return { total, active, inactive }
  }, [mealPlans])

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meus Planos Alimentares</h1>
            <p className="text-muted-foreground">
              Acompanhe seus planos nutricionais criados pelo seu nutricionista
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">planos recebidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">concluídos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium mr-2">Filtrar por:</span>
            
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('all')}
            >
              Todos
            </Button>
            <Button
              variant={selectedStatus === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('active')}
            >
              Ativos
            </Button>
            <Button
              variant={selectedStatus === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('inactive')}
            >
              Finalizados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans List */}
      <div className="space-y-4">
        {loading && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Carregando seus planos alimentares...</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!loading && mealPlans.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedStatus !== 'all' 
                    ? 'Tente ajustar os filtros ou aguarde seu nutricionista criar um plano'
                    : 'Aguarde seu nutricionista criar seus primeiros planos alimentares'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!loading && mealPlans.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {mealPlans.map((plan) => (
              <MealPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Component para o card de meal plan do cliente
function MealPlanCard({ plan }: { readonly plan: MealPlan }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isExpired = new Date(plan.endDate) < new Date()
  const isActive = plan.isActive && !isExpired

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.title}</CardTitle>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Ativo' : 'Finalizado'}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {plan.description || 'Sem descrição'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informações do Nutricionista */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Por: {plan.contract?.nutritionist.user.name || 'Nutricionista não identificado'}</span>
        </div>

        {/* Período */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
          </span>
        </div>

        {/* Número de refeições */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            {plan.meals?.length || 0} {(plan.meals?.length || 0) === 1 ? 'refeição' : 'refeições'}
          </span>
        </div>

        {/* Informações nutricionais */}
        {plan.totalCalories && (
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Calorias:</span>
                <span className="ml-1 font-medium">{Math.round(plan.totalCalories)} kcal</span>
              </div>
              <div>
                <span className="text-muted-foreground">Proteínas:</span>
                <span className="ml-1 font-medium">{Math.round(plan.totalProteins || 0)}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Carboidratos:</span>
                <span className="ml-1 font-medium">{Math.round(plan.totalCarbs || 0)}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Gorduras:</span>
                <span className="ml-1 font-medium">{Math.round(plan.totalFats || 0)}g</span>
              </div>
            </div>
          </div>
        )}

        {/* Botão para ver detalhes */}
        <Link href={`/dashboard/client/meal-plans/${plan.id}`} className="block">
          <Button className="w-full" variant="outline">
            Ver Detalhes
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function ClientMealPlansPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    }>
      <ClientMealPlansContent />
    </Suspense>
  )
}