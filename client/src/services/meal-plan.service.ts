import { BaseService, PaginationResult } from './base.service'

// Types para Meal Plans
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'

export interface MealPlan {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  isActive: boolean
  totalCalories?: number
  totalProteins?: number
  totalCarbs?: number
  totalFats?: number
  totalFiber?: number
  contractId: string
  clientId?: string
  createdAt: string
  updatedAt: string
  meals?: Meal[]
  contract?: {
    id: string
    client: {
      id: string
      name: string
      email: string
      phone?: string
    }
    nutritionist: {
      id: string
      crn: string
      specialty?: string
      experience?: number
      bio?: string
      pricePerHour?: number
      isActive: boolean
      user: {
        id: string
        name: string
        email: string
        phone?: string
      }
    }
  }
}

export interface Meal {
  id: string
  name: string
  type: MealType
  time?: string
  suggestedTime?: string // Campo do backend
  calories: number
  proteins: number
  carbs: number
  fats: number
  fiber: number
  mealPlanId: string
  createdAt: string
  updatedAt: string
  foods?: MealFood[]
}

export interface MealFood {
  id: string
  quantity: number
  unit: string
  calories: number
  proteins: number
  carbs: number
  fats: number
  fiber: number
  mealId: string
  foodId: string
  food: {
    id: string
    name: string
    category: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateMealPlanData {
  title: string
  description?: string
  startDate: string
  endDate: string
  contractId: string
}

export interface UpdateMealPlanData {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
}

export interface CreateMealData {
  name: string
  type: MealType
  suggestedTime?: string
  mealPlanId: string
  foods?: Array<{
    foodId: string
    quantity: number
    unit: string
  }>
}

export interface UpdateMealData {
  name?: string
  type?: MealType
  suggestedTime?: string
  foods?: Array<{
    foodId: string
    quantity: number
    unit: string
  }>
}

export interface MealPlanFilters {
  search?: string
  isActive?: boolean
  contractId?: string
  clientId?: string
  nutritionistId?: string
  startDate?: string
  endDate?: string
  skip?: number
  take?: number
  [key: string]: unknown
}

export interface CopyPlanOptions {
  sourcePlanId: string
  name: string
  description?: string
  startDate: string
  endDate: string
  contractId?: string
  clientId?: string
  [key: string]: unknown
}

export interface NutritionalLimits {
  maxCalories?: number
  minCalories?: number
  maxProteins?: number
  minProteins?: number
  maxCarbs?: number
  minCarbs?: number
  maxFats?: number
  minFats?: number
  [key: string]: unknown
}

export interface PlanStatistics {
  totalPlans: number
  activePlans: number
  avgCalories: number
  avgProteins: number
  avgCarbs: number
  avgFats: number
  mostUsedFoods: Array<{
    food: string
    count: number
  }>
}

export class MealPlanService extends BaseService {
  // Listar planos com filtros e paginação
  static async getAll(filters: MealPlanFilters = {}): Promise<PaginationResult<MealPlan>> {
    const params = this.buildQueryParams(filters)
    const url = this.buildUrl('/meal-plans', params)
    return this.getPaginated<MealPlan>(url, 'Erro ao buscar planos alimentares')
  }

  // Buscar plano por ID
  static async getById(id: string): Promise<MealPlan> {
    return this.getSingle<MealPlan>(`/meal-plans/${id}`, 'Plano alimentar não encontrado')
  }

  // Criar plano
  static async create(data: CreateMealPlanData, limits?: NutritionalLimits): Promise<MealPlan> {
    const payload = limits ? { ...data, limits } : data
    return this.post<MealPlan>('/meal-plans', payload, 'Erro ao criar plano alimentar')
  }

  // Atualizar plano
  static async update(id: string, data: UpdateMealPlanData): Promise<MealPlan> {
    return this.put<MealPlan>(`/meal-plans/${id}`, data, 'Erro ao atualizar plano alimentar')
  }

  // Deletar plano
  static async delete(id: string): Promise<void> {
    return super.delete(`/meal-plans/${id}`, 'Erro ao deletar plano alimentar')
  }

  // Adicionar refeição ao plano
  static async addMeal(data: CreateMealData, limits?: NutritionalLimits): Promise<Meal> {
    const payload = limits ? { ...data, limits } : data
    return this.post<Meal>('/meal-plans/meals', payload, 'Erro ao adicionar refeição')
  }

  // Atualizar refeição existente
  static async updateMeal(mealId: string, data: UpdateMealData, limits?: NutritionalLimits): Promise<Meal> {
    const payload = limits ? { ...data, limits } : data
    return this.put<Meal>(`/meal-plans/meals/${mealId}`, payload, 'Erro ao atualizar refeição')
  }

  // Copiar plano existente
  static async copyPlan(options: CopyPlanOptions): Promise<MealPlan> {
    return this.post<MealPlan>('/meal-plans/copy', options, 'Erro ao copiar plano alimentar')
  }

  // Recalcular valores nutricionais
  static async recalculateNutrition(id: string): Promise<MealPlan> {
    return this.put<MealPlan>(`/meal-plans/${id}/recalculate`, {}, 'Erro ao recalcular nutrição')
  }

  // Buscar estatísticas do plano
  static async getStatistics(id: string): Promise<PlanStatistics> {
    return this.getSingle<PlanStatistics>(`/meal-plans/${id}/statistics`, 'Erro ao buscar estatísticas')
  }
}