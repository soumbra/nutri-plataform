'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Calendar, Users, TrendingUp, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useMealPlans } from '@/hooks/useMealPlans'
import type { MealPlanFilters, MealPlan } from '@/services/meal-plan.service'
import Link from 'next/link'

export default function MealPlansPage() {
  const [searchQuery, setSearchQuery] = useState('')
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
      isActive: isActiveFilter,
      search: searchQuery.trim() || undefined
    }
  }, [searchQuery, selectedStatus])

  const { 
    mealPlans, 
    loading, 
    error, 
    pagination,
    fetchPlans,
    deletePlan 
  } = useMealPlans({
    initialFilters: filters,
    autoFetch: true
  })

  // Stats calculadas
  const stats = useMemo(() => {
    const total = mealPlans.length
    const active = mealPlans.filter(plan => plan.isActive).length
    const inactive = mealPlans.filter(plan => !plan.isActive).length
    const avgCalories = total > 0 
      ? Math.round(mealPlans.reduce((sum, plan) => sum + (plan.totalCalories || 0), 0) / total)
      : 0

    return { total, active, inactive, avgCalories }
  }, [mealPlans])

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este plano alimentar?')) {
      const success = await deletePlan(id)
      if (success) {
        await fetchPlans(filters)
      }
    }
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Erro ao carregar planos alimentares: {error}</p>
              <Button onClick={() => fetchPlans(filters)}>Tentar Novamente</Button>
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
            <h1 className="text-2xl font-bold tracking-tight">Planos Alimentares</h1>
            <p className="text-muted-foreground">
              Gerencie seus planos alimentares e acompanhe o progresso dos clientes
            </p>
          </div>
        </div>
        <Link href="/dashboard/nutritionist/meal-plans/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">planos criados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">pausados/concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calorias Médias</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCalories}</div>
            <p className="text-xs text-muted-foreground">kcal por plano</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do cliente ou plano..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
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
                Inativos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Plans List */}
      <div className="space-y-4">
        {loading && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Carregando planos alimentares...</p>
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
                  {searchQuery || selectedStatus !== 'all' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando seu primeiro plano alimentar'
                  }
                </p>
                <Link href="/dashboard/nutritionist/meal-plans/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Plano
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!loading && mealPlans.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {mealPlans.map((plan) => (
              <MealPlanCard
                key={plan.id}
                plan={plan}
                onDelete={() => handleDelete(plan.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Página {pagination.current} de {pagination.pages} ({pagination.total} total)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Component para o card de meal plan
function MealPlanCard({ 
  plan, 
  onDelete 
}: { 
  readonly plan: MealPlan
  readonly onDelete: () => void 
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{plan.title}</CardTitle>
            <CardDescription className="mt-1">
              {plan.description || 'Sem descrição'}
            </CardDescription>
          </div>
          <Badge variant={plan.isActive ? 'default' : 'secondary'}>
            {plan.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Nutrition Summary */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Calorias</p>
            <p className="font-medium">{plan.totalCalories || 0} kcal</p>
          </div>
          <div>
            <p className="text-muted-foreground">Refeições</p>
            <p className="font-medium">{plan.meals?.length || 0} refeições</p>
          </div>
          <div>
            <p className="text-muted-foreground">Proteínas</p>
            <p className="font-medium">{plan.totalProteins || 0}g</p>
          </div>
          <div>
            <p className="text-muted-foreground">Carboidratos</p>
            <p className="font-medium">{plan.totalCarbs || 0}g</p>
          </div>
        </div>

        {/* Dates */}
        {(plan.startDate || plan.endDate) && (
          <div className="text-xs text-muted-foreground border-t pt-3">
            {plan.startDate && (
              <p>Início: {new Date(plan.startDate).toLocaleDateString('pt-BR')}</p>
            )}
            {plan.endDate && (
              <p>Término: {new Date(plan.endDate).toLocaleDateString('pt-BR')}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/dashboard/nutritionist/meal-plans/${plan.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Ver Detalhes
            </Button>
          </Link>
          <Link href={`/dashboard/nutritionist/meal-plans/${plan.id}/edit`}>
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            title="Excluir plano"
          >
            ×
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}