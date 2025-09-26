'use client'
import { useState, useEffect, useCallback } from 'react'
import { MealPlanService } from '@/services/meal-plan.service'
import type {
  MealPlan,
  CreateMealPlanData,
  UpdateMealPlanData,
  CreateMealData,
  MealPlanFilters,
  CopyPlanOptions,
  NutritionalLimits,
  PlanStatistics,
  Meal
} from '@/services/meal-plan.service'
import type { PaginationResult } from '@/services/base.service'
import { useCrudStates } from './useBaseHook'
import { useAuth } from '@/contexts/AuthContext'

// Types específicos do hook
export interface UseMealPlansOptions {
  initialFilters?: MealPlanFilters
  autoFetch?: boolean
}

export interface UseMealPlansReturn {
  // Estado dos dados
  mealPlans: MealPlan[]
  currentPlan: MealPlan | null
  pagination: { total: number; pages: number; current: number } | null
  statistics: PlanStatistics | null

  // Estados de loading
  loading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  copying: boolean
  addingMeal: boolean

  // Estados de error
  error: string | null
  createError: string | null
  updateError: string | null
  deleteError: string | null

  // Operações CRUD
  fetchPlans: (filters?: MealPlanFilters) => Promise<void>
  fetchPlanById: (id: string) => Promise<void>
  createPlan: (data: CreateMealPlanData, limits?: NutritionalLimits) => Promise<MealPlan | null>
  updatePlan: (id: string, data: UpdateMealPlanData) => Promise<MealPlan | null>
  deletePlan: (id: string) => Promise<boolean>
  
  // Operações especiais
  copyPlan: (options: CopyPlanOptions) => Promise<MealPlan | null>
  addMeal: (data: CreateMealData, limits?: NutritionalLimits) => Promise<Meal | null>
  recalculateNutrition: (id: string) => Promise<MealPlan | null>
  fetchStatistics: (id: string) => Promise<void>
  
  // Helpers
  clearErrors: () => void
  refreshPlans: () => Promise<void>
  setCurrentPlan: (plan: MealPlan | null) => void
}

export function useMealPlans(options: UseMealPlansOptions = {}): UseMealPlansReturn {
  const { initialFilters = {}, autoFetch = true } = options
  const { user } = useAuth()

  // Estados principais
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null)
  const [pagination, setPagination] = useState<{ total: number; pages: number; current: number } | null>(null)
  const [statistics, setStatistics] = useState<PlanStatistics | null>(null)

  // Estados específicos não cobertos pelo BaseHook
  const copying = false // Será implementado quando necessário
  const addingMeal = false // Será implementado quando necessário

  // Using BaseHook para gerenciar estados padrão
  const {
    loadingStates,
    errorStates,
    clearErrors,
    executeWithStates,
    executeFetch,
    executeCreate,
    executeUpdate,
    executeDelete
  } = useCrudStates()

  // ===== HELPER ESPECÍFICO PARA MEAL PLANS =====
  
  // Helper para atualizar plano na lista e currentPlan
  const updatePlanInState = useCallback((id: string, updatedPlan: MealPlan) => {
    setMealPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
    if (currentPlan?.id === id) {
      setCurrentPlan(updatedPlan)
    }
  }, [currentPlan])

  // Helper para remover plano dos estados
  const removePlanFromState = useCallback((id: string) => {
    setMealPlans(prev => prev.filter(plan => plan.id !== id))
    if (currentPlan?.id === id) {
      setCurrentPlan(null)
    }
  }, [currentPlan])

  // Helper para adicionar plano copiado
  const addCopiedPlanToState = useCallback((copiedPlan: MealPlan) => {
    setMealPlans(prev => [copiedPlan, ...prev])
  }, [])

  // Helper para atualizar plano com nova refeição
  const addMealToPlan = useCallback((planId: string, meal: Meal) => {
    if (currentPlan && currentPlan.id === planId) {
      const updatedPlan = { 
        ...currentPlan, 
        meals: [...(currentPlan.meals || []), meal] 
      }
      setCurrentPlan(updatedPlan)
      updatePlanInState(planId, updatedPlan)
    }
  }, [currentPlan, updatePlanInState])    // ===== OPERAÇÕES CRUD =====

  // Buscar planos com filtros
  const fetchPlans = useCallback(async (filters: MealPlanFilters = {}): Promise<void> => {
    await executeFetch(async () => {
      // Se o usuário é um nutricionista, filtrar apenas seus planos
      const enhancedFilters = user?.role === 'NUTRITIONIST' && user.nutritionistProfile?.id 
        ? { ...filters, nutritionistId: user.nutritionistProfile.id }
        : filters
        
      const result: PaginationResult<MealPlan> = await MealPlanService.getAll(enhancedFilters)
      setMealPlans(result.data)
      setPagination(result.pagination)
      return result
    })
  }, [executeFetch, user])

  // Buscar plano específico por ID
  const fetchPlanById = useCallback(async (id: string): Promise<void> => {
    await executeFetch(async () => {
      const plan = await MealPlanService.getById(id)
      setCurrentPlan(plan)
      return plan
    })
  }, [executeFetch])

  // Criar novo plano
  const createPlan = useCallback(async (
    data: CreateMealPlanData, 
    limits?: NutritionalLimits
  ): Promise<MealPlan | null> => {
    return await executeCreate(async () => {
      const newPlan = await MealPlanService.create(data, limits)
      setMealPlans(prev => [newPlan, ...prev])
      return newPlan
    })
  }, [executeCreate])

  // Atualizar plano
  const updatePlan = useCallback(async (
    id: string, 
    data: UpdateMealPlanData
  ): Promise<MealPlan | null> => {
    return await executeUpdate(async () => {
      const updatedPlan = await MealPlanService.update(id, data)
      updatePlanInState(id, updatedPlan)
      return updatedPlan
    })
  }, [executeUpdate, updatePlanInState])

  // Deletar plano
  const deletePlan = useCallback(async (id: string): Promise<boolean> => {
    const result = await executeDelete(async () => {
      await MealPlanService.delete(id)
      removePlanFromState(id)
      return true
    })
    return result !== null
  }, [executeDelete, removePlanFromState])

  // Copiar plano
  const copyPlan = useCallback(async (options: CopyPlanOptions): Promise<MealPlan | null> => {
    return await executeWithStates(async () => {
      const copiedPlan = await MealPlanService.copyPlan(options)
      addCopiedPlanToState(copiedPlan)
      return copiedPlan
    }, {
      loadingState: 'creating',
      errorState: 'createError',
      defaultErrorMessage: 'Erro ao copiar plano'
    })
  }, [executeWithStates, addCopiedPlanToState])

  // Adicionar refeição
  const addMeal = useCallback(async (
    data: CreateMealData, 
    limits?: NutritionalLimits
  ): Promise<Meal | null> => {
    return await executeWithStates(async () => {
      const meal = await MealPlanService.addMeal(data, limits)
      addMealToPlan(data.mealPlanId, meal)
      return meal
    }, {
      loadingState: 'creating',
      errorState: 'createError',
      defaultErrorMessage: 'Erro ao adicionar refeição'
    })
  }, [executeWithStates, addMealToPlan])

  // Recalcular nutrição
  const recalculateNutrition = useCallback(async (id: string): Promise<MealPlan | null> => {
    return await executeUpdate(async () => {
      const updatedPlan = await MealPlanService.recalculateNutrition(id)
      updatePlanInState(id, updatedPlan)
      return updatedPlan
    })
  }, [executeUpdate, updatePlanInState])

  // Buscar estatísticas do plano
  const fetchStatistics = useCallback(async (id: string): Promise<void> => {
    await executeFetch(async () => {
      const stats = await MealPlanService.getStatistics(id)
      setStatistics(stats)
      return stats
    })
  }, [executeFetch])

  // Refresh (refetch com filtros atuais)
  const refreshPlans = useCallback(async () => {
    await fetchPlans(initialFilters)
  }, [fetchPlans, initialFilters])

  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchPlans(initialFilters)
    }
  }, [autoFetch, fetchPlans, initialFilters])

  return {
    // Estado dos dados
    mealPlans,
    currentPlan,
    pagination,
    statistics,

    // Estados de loading (do BaseHook + específicos)
    loading: loadingStates.loading,
    creating: loadingStates.creating,
    updating: loadingStates.updating,
    deleting: loadingStates.deleting,
    copying,
    addingMeal,

    // Estados de error (do BaseHook)
    error: errorStates.error,
    createError: errorStates.createError,
    updateError: errorStates.updateError,
    deleteError: errorStates.deleteError,

    // Operações CRUD
    fetchPlans,
    fetchPlanById,
    createPlan,
    updatePlan,
    deletePlan,

    // Operações especiais
    copyPlan,
    addMeal,
    recalculateNutrition,
    fetchStatistics,

    // Helpers
    clearErrors,
    refreshPlans,
    setCurrentPlan
  }
}