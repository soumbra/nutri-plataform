'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Calendar, Clock, User, Utensils } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMealPlans } from '@/hooks/useMealPlans'
import type { MealPlan } from '@/services/meal-plan.service'
import Link from 'next/link'

interface MealPlanDetailPageProps {
  readonly params: Promise<{
    readonly id: string
  }>
}

function MealPlanDetailContent({ params }: MealPlanDetailPageProps) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  const { 
    currentPlan,
    loading,
    error,
    fetchPlanById
  } = useMealPlans()

  // Resolver os params assíncronos
  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  // Buscar o plano quando o ID estiver disponível
  useEffect(() => {
    if (resolvedParams?.id) {
      fetchPlanById(resolvedParams.id)
    }
  }, [resolvedParams?.id, fetchPlanById])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Carregando detalhes do plano...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => router.back()}>
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentPlan) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Plano não encontrado</h3>
              <p className="text-muted-foreground mb-4">
                O plano alimentar solicitado não foi encontrado ou você não tem acesso a ele.
              </p>
              <Link href="/dashboard/client/meal-plans">
                <Button>Voltar aos Meus Planos</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <MealPlanDetailView plan={currentPlan} />
}

function MealPlanDetailView({ plan }: { readonly plan: MealPlan }) {
  // Calcular totais do lado cliente como fallback
  const calculateTotals = useMemo(() => {
    if (!plan.meals || plan.meals.length === 0) {
      return {
        totalCalories: 0,
        totalProteins: 0,
        totalCarbs: 0,
        totalFats: 0
      }
    }

    let calories = 0
    let proteins = 0
    let carbs = 0
    let fats = 0

    plan.meals.forEach(meal => {
      if (meal.calories) calories += meal.calories
      if (meal.proteins) proteins += meal.proteins
      if (meal.carbs) carbs += meal.carbs
      if (meal.fats) fats += meal.fats
    })

    return {
      totalCalories: Math.round(calories * 100) / 100,
      totalProteins: Math.round(proteins * 100) / 100,
      totalCarbs: Math.round(carbs * 100) / 100,
      totalFats: Math.round(fats * 100) / 100
    }
  }, [plan.meals])

  // Usar valores do backend se disponíveis, caso contrário usar cálculo local
  const nutritionTotals = {
    totalCalories: plan.totalCalories ?? calculateTotals.totalCalories,
    totalProteins: plan.totalProteins ?? calculateTotals.totalProteins,
    totalCarbs: plan.totalCarbs ?? calculateTotals.totalCarbs,
    totalFats: plan.totalFats ?? calculateTotals.totalFats
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ''
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = new Date(plan.endDate) < new Date()
  const isActive = plan.isActive && !isExpired

  const mealTypeLabels = {
    BREAKFAST: 'Café da Manhã',
    LUNCH: 'Almoço', 
    DINNER: 'Jantar',
    SNACK: 'Lanche'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/client/meal-plans">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Meus Planos
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{plan.title}</h1>
              <p className="text-muted-foreground">
                {plan.description || 'Plano alimentar personalizado'}
              </p>
            </div>
            <Badge variant={isActive ? 'default' : 'secondary'} className="text-sm">
              {isActive ? 'Ativo' : 'Finalizado'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Informações Gerais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nutricionista</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{plan.contract?.nutritionist.user.name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              CRN: {plan.contract?.nutritionist.crn || 'N/A'}
            </p>
            {plan.contract?.nutritionist.specialty && (
              <p className="text-xs text-muted-foreground">
                {plan.contract.nutritionist.specialty}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">De: {formatDate(plan.startDate)}</div>
            <div className="text-sm font-medium">Até: {formatDate(plan.endDate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(() => {
                if (isExpired) return 'Plano expirado'
                if (isActive) return 'Em andamento'
                return 'Inativo'
              })()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refeições</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.meals?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {(plan.meals?.length || 0) === 1 ? 'refeição planejada' : 'refeições planejadas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calorias Totais</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nutritionTotals.totalCalories ? Math.round(nutritionTotals.totalCalories) : 0}
            </div>
            <p className="text-xs text-muted-foreground">kcal por dia</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Nutricional */}
      {(nutritionTotals.totalCalories || nutritionTotals.totalProteins || nutritionTotals.totalCarbs || nutritionTotals.totalFats) && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo Nutricional Diário</CardTitle>
            <CardDescription>
              Valores totais planejados para cada dia seguindo este plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(nutritionTotals.totalCalories)}
                </div>
                <div className="text-sm text-muted-foreground">Calorias (kcal)</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(nutritionTotals.totalProteins)}g
                </div>
                <div className="text-sm text-muted-foreground">Proteínas</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(nutritionTotals.totalCarbs)}g
                </div>
                <div className="text-sm text-muted-foreground">Carboidratos</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(nutritionTotals.totalFats)}g
                </div>
                <div className="text-sm text-muted-foreground">Gorduras</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refeições Detalhadas */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Refeições Planejadas</h2>
          {!plan.meals || plan.meals.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Utensils className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma refeição planejada</h3>
                  <p className="text-muted-foreground">
                    Este plano ainda não possui refeições configuradas.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {plan.meals.map((meal, index) => (
                <Card key={meal.id || index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{meal.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span>{mealTypeLabels[meal.type] || meal.type}</span>
                          {(meal.time || meal.suggestedTime) && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(meal.time || meal.suggestedTime)}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {Math.round(meal.calories || 0)} kcal
                        </div>
                        <div className="text-xs text-muted-foreground">
                          P: {Math.round(meal.proteins || 0)}g | 
                          C: {Math.round(meal.carbs || 0)}g | 
                          G: {Math.round(meal.fats || 0)}g
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!meal.foods || meal.foods.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        Nenhum alimento especificado para esta refeição
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {meal.foods.map((mealFood, foodIndex) => (
                          <div 
                            key={mealFood.id || `${meal.id}-${foodIndex}`}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{mealFood.food.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {mealFood.food.category}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {mealFood.quantity}
                                {mealFood.unit ? ` ${mealFood.unit}` : 'g'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {Math.round(mealFood.calories || 0)} kcal
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MealPlanDetailPage({ params }: MealPlanDetailPageProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    }>
      <MealPlanDetailContent params={params} />
    </Suspense>
  )
}