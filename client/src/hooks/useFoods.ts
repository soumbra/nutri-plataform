'use client'
import { useState, useEffect, useCallback } from 'react'
import { FoodService } from '@/services/food.service'
import type {
  Food,
  CreateFoodData,
  UpdateFoodData,
  FoodFilters,
  NutritionalSearch
} from '@/services/food.service'
import type { PaginationResult } from '@/services/base.service'
import { useCrudStates } from './useBaseHook'

// Types específicos do hook
export interface UseFoodsOptions {
  initialFilters?: FoodFilters
  autoFetch?: boolean
  pageSize?: number
}

export interface SelectedFood {
  food: Food
  quantity: number
  unit: string
}

export interface UseFoodsReturn {
  // Estado dos dados
  foods: Food[]
  currentFood: Food | null
  categories: string[]
  popularFoods: Food[]
  selectedFoods: SelectedFood[]
  pagination: { total: number; pages: number; current: number } | null

  // Estados de loading
  loading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  loadingCategories: boolean
  loadingPopular: boolean
  searching: boolean

  // Estados de error
  error: string | null
  createError: string | null
  updateError: string | null
  deleteError: string | null

  // Operações CRUD (apenas para nutricionistas)
  fetchFoods: (filters?: FoodFilters) => Promise<void>
  fetchFoodById: (id: string) => Promise<void>
  createFood: (data: CreateFoodData) => Promise<Food | null>
  updateFood: (id: string, data: UpdateFoodData) => Promise<Food | null>
  deleteFood: (id: string) => Promise<boolean>

  // Operações de busca
  searchFoods: (query: string) => Promise<void>
  searchByNutrition: (search: NutritionalSearch) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchPopular: (limit?: number) => Promise<void>
  filterByCategory: (category: string) => Promise<void>

  // Gerenciamento de seleção
  selectFood: (food: Food, quantity: number, unit: string) => void
  unselectFood: (foodId: string) => void
  updateSelectedFood: (foodId: string, quantity: number, unit: string) => void
  clearSelection: () => void
  calculateTotalNutrition: () => {
    calories: number
    proteins: number
    carbs: number
    fats: number
    fiber: number
  }

  // Helpers
  clearErrors: () => void
  refreshFoods: () => Promise<void>
  setCurrentFood: (food: Food | null) => void
  resetFilters: () => Promise<void>
}

export function useFoods(options: UseFoodsOptions = {}): UseFoodsReturn {
  const { 
    initialFilters = {}, 
    autoFetch = true,
    pageSize = 20 
  } = options

  // Estados principais
  const [foods, setFoods] = useState<Food[]>([])
  const [currentFood, setCurrentFood] = useState<Food | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [popularFoods, setPopularFoods] = useState<Food[]>([])
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([])
  const [pagination, setPagination] = useState<{ total: number; pages: number; current: number } | null>(null)

  // Estados específicos não cobertos pelo BaseHook
  const loadingCategories = false
  const searching = false

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

  // ===== HELPERS ESPECÍFICOS PARA FOODS =====
  
  // Helper para atualizar food na lista e currentFood
  const updateFoodInState = useCallback((id: string, updatedFood: Food) => {
    setFoods(prev => prev.map(food => food.id === id ? updatedFood : food))
    if (currentFood?.id === id) {
      setCurrentFood(updatedFood)
    }
  }, [currentFood])

  // Helper para remover food dos estados
  const removeFoodFromState = useCallback((id: string) => {
    setFoods(prev => prev.filter(food => food.id !== id))
    if (currentFood?.id === id) {
      setCurrentFood(null)
    }
  }, [currentFood])

  // Helper para remover food da seleção
  const removeFoodFromSelection = useCallback((id: string) => {
    setSelectedFoods(prev => prev.filter(selected => selected.food.id !== id))
  }, [])

  // ===== OPERAÇÕES CRUD =====

  // Buscar alimentos com filtros
  const fetchFoods = useCallback(async (filters: FoodFilters = {}): Promise<void> => {
    await executeFetch(async () => {
      const result: PaginationResult<Food> = await FoodService.getAll({
        ...filters,
        take: filters.take || pageSize
      })
      setFoods(result.data)
      setPagination(result.pagination)
      return result
    })
  }, [executeFetch, pageSize])

  // Buscar alimento específico por ID
  const fetchFoodById = useCallback(async (id: string): Promise<void> => {
    await executeFetch(async () => {
      const food = await FoodService.getById(id)
      setCurrentFood(food)
      return food
    })
  }, [executeFetch])

  // Criar novo alimento (apenas nutricionistas)
  const createFood = useCallback(async (data: CreateFoodData): Promise<Food | null> => {
    return await executeCreate(async () => {
      const newFood = await FoodService.create(data)
      setFoods(prev => [newFood, ...prev])
      return newFood
    })
  }, [executeCreate])

  // Atualizar alimento (apenas nutricionistas)
  const updateFood = useCallback(async (
    id: string, 
    data: UpdateFoodData
  ): Promise<Food | null> => {
    return await executeUpdate(async () => {
      const updatedFood = await FoodService.update(id, data)
      updateFoodInState(id, updatedFood)
      return updatedFood
    })
  }, [executeUpdate, updateFoodInState])

  // Deletar alimento (apenas nutricionistas)
  const deleteFood = useCallback(async (id: string): Promise<boolean> => {
    const result = await executeDelete(async () => {
      await FoodService.delete(id)
      removeFoodFromState(id)
      removeFoodFromSelection(id)
      return true
    })
    return result !== null
  }, [executeDelete, removeFoodFromState, removeFoodFromSelection])

  // ===== OPERAÇÕES DE BUSCA =====
  // Buscar alimentos por texto
  const searchFoods = useCallback(async (query: string): Promise<void> => {
    await executeWithStates(async () => {
      const filters: FoodFilters = { 
        search: query,
        take: pageSize
      }
      const result: PaginationResult<Food> = await FoodService.getAll(filters)
      setFoods(result.data)
      setPagination(result.pagination)
      return result
    }, {
      loadingState: 'loading', // Usar loading genérico para search
      errorState: 'error',
      defaultErrorMessage: 'Erro na busca de alimentos'
    })
  }, [executeWithStates, pageSize])

  // Buscar por perfil nutricional
  const searchByNutrition = useCallback(async (search: NutritionalSearch): Promise<void> => {
    await executeWithStates(async () => {
      const result: PaginationResult<Food> = await FoodService.searchByNutrition(search)
      setFoods(result.data)
      setPagination(result.pagination)
      return result
    }, {
      loadingState: 'loading',
      errorState: 'error',
      defaultErrorMessage: 'Erro na busca nutricional'
    })
  }, [executeWithStates])

  // Buscar categorias disponíveis
  const fetchCategories = useCallback(async (): Promise<void> => {
    await executeWithStates(async () => {
      const data = await FoodService.getCategories()
      setCategories(data)
      return data
    }, {
      loadingState: 'loading',
      errorState: 'error',
      defaultErrorMessage: 'Erro ao carregar categorias'
    })
  }, [executeWithStates])

  // Buscar alimentos populares
  const fetchPopular = useCallback(async (limit: number = 10): Promise<void> => {
    await executeWithStates(async () => {
      const data = await FoodService.getPopular(limit)
      setPopularFoods(data)
      return data
    }, {
      loadingState: 'loading',
      errorState: 'error',
      defaultErrorMessage: 'Erro ao carregar alimentos populares'
    })
  }, [executeWithStates])

  // Filtrar por categoria
  const filterByCategory = useCallback(async (category: string) => {
    const filters: FoodFilters = { 
      category,
      take: pageSize
    }
    await fetchFoods(filters)
  }, [fetchFoods, pageSize])

  // ===== GERENCIAMENTO DE SELEÇÃO =====

  // Selecionar alimento
  const selectFood = useCallback((food: Food, quantity: number, unit: string) => {
    setSelectedFoods(prev => {
      const existing = prev.find(selected => selected.food.id === food.id)
      return existing 
        ? prev.map(selected => 
            selected.food.id === food.id 
              ? { ...selected, quantity, unit }
              : selected
          )
        : [...prev, { food, quantity, unit }]
    })
  }, [])

  // Remover alimento da seleção
  const unselectFood = useCallback((foodId: string) => {
    setSelectedFoods(prev => prev.filter(selected => selected.food.id !== foodId))
  }, [])

  // Atualizar quantidade/unidade de alimento selecionado
  const updateSelectedFood = useCallback((foodId: string, quantity: number, unit: string) => {
    setSelectedFoods(prev => 
      prev.map(selected => 
        selected.food.id === foodId 
          ? { ...selected, quantity, unit }
          : selected
      )
    )
  }, [])

  // Limpar seleção
  const clearSelection = useCallback(() => {
    setSelectedFoods([])
  }, [])

  // Calcular nutrição total dos alimentos selecionados
  const calculateTotalNutrition = useCallback(() => {
    return selectedFoods.reduce((total, selected) => {
      const multiplier = selected.quantity / 100 // Assumindo valores por 100g
      return {
        calories: total.calories + (selected.food.calories * multiplier),
        proteins: total.proteins + (selected.food.proteins * multiplier),
        carbs: total.carbs + (selected.food.carbs * multiplier),
        fats: total.fats + (selected.food.fats * multiplier),
        fiber: total.fiber + (selected.food.fiber * multiplier)
      }
    }, {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      fiber: 0
    })
  }, [selectedFoods])

  // ===== HELPERS =====

  // Reset filtros para estado inicial
  const resetFilters = useCallback(async () => {
    await fetchFoods(initialFilters)
  }, [fetchFoods, initialFilters])

  // Refresh (refetch com filtros atuais)
  const refreshFoods = useCallback(async () => {
    await fetchFoods(initialFilters)
  }, [fetchFoods, initialFilters])

  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchFoods(initialFilters)
    }
  }, [autoFetch, fetchFoods, initialFilters])

  return {
    // Estado dos dados
    foods,
    currentFood,
    categories,
    popularFoods,
    selectedFoods,
    pagination,

    // Estados de loading (do BaseHook + específicos)
    loading: loadingStates.loading,
    creating: loadingStates.creating,
    updating: loadingStates.updating,
    deleting: loadingStates.deleting,
    loadingCategories,
    loadingPopular: loadingStates.loading,
    searching,

    // Estados de error (do BaseHook)
    error: errorStates.error,
    createError: errorStates.createError,
    updateError: errorStates.updateError,
    deleteError: errorStates.deleteError,

    // Operações CRUD
    fetchFoods,
    fetchFoodById,
    createFood,
    updateFood,
    deleteFood,

    // Operações de busca
    searchFoods,
    searchByNutrition,
    fetchCategories,
    fetchPopular,
    filterByCategory,

    // Gerenciamento de seleção
    selectFood,
    unselectFood,
    updateSelectedFood,
    clearSelection,
    calculateTotalNutrition,

    // Helpers
    clearErrors,
    refreshFoods,
    setCurrentFood,
    resetFilters
  }
}