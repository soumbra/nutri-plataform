import { BaseService, PaginationResult } from './base.service'

// Types para Foods
export interface Food {
  id: string
  name: string
  category: string
  calories: number
  proteins: number
  carbs: number
  fats: number
  fiber: number
  createdAt: string
  updatedAt: string
}

export interface CreateFoodData {
  name: string
  category: string
  calories: number
  proteins: number
  carbs: number
  fats: number
  fiber?: number
}

export interface UpdateFoodData {
  name?: string
  category?: string
  calories?: number
  proteins?: number
  carbs?: number
  fats?: number
  fiber?: number
}

export interface FoodFilters {
  search?: string
  category?: string
  minCalories?: number
  maxCalories?: number
  minProteins?: number
  maxProteins?: number
  minCarbs?: number
  maxCarbs?: number
  minFats?: number
  maxFats?: number
  hasCategory?: boolean
  skip?: number
  take?: number
  [key: string]: unknown
}

export interface NutritionalSearch {
  targetCalories?: number
  targetProteins?: number
  tolerance?: number
  skip?: number
  take?: number
  [key: string]: unknown
}

export class FoodService extends BaseService {
  // Listar alimentos com filtros e paginação
  static async getAll(filters: FoodFilters = {}): Promise<PaginationResult<Food>> {
    const params = this.buildQueryParams(filters)
    const url = this.buildUrl('/foods', params)
    return this.getPaginated<Food>(url, 'Erro ao buscar alimentos')
  }

  // Buscar alimento por ID
  static async getById(id: string): Promise<Food> {
    return this.getSingle<Food>(`/foods/${id}`, 'Alimento não encontrado')
  }

  // Criar alimento (apenas nutricionistas)
  static async create(data: CreateFoodData): Promise<Food> {
    return this.post<Food>('/foods', data, 'Erro ao criar alimento')
  }

  // Atualizar alimento (apenas nutricionistas)
  static async update(id: string, data: UpdateFoodData): Promise<Food> {
    return this.put<Food>(`/foods/${id}`, data, 'Erro ao atualizar alimento')
  }

  // Deletar alimento (apenas nutricionistas)
  static async delete(id: string): Promise<void> {
    return super.delete(`/foods/${id}`, 'Erro ao deletar alimento')
  }

  // Buscar categorias disponíveis
  static async getCategories(): Promise<string[]> {
    return this.getArray<string>('/foods/categories', 'Erro ao buscar categorias')
  }

  // Buscar alimentos populares
  static async getPopular(limit: number = 20): Promise<Food[]> {
    const params = this.buildQueryParams({ limit })
    const url = this.buildUrl('/foods/popular', params)
    return this.getArray<Food>(url, 'Erro ao buscar alimentos populares')
  }

  // Buscar por perfil nutricional
  static async searchByNutrition(search: NutritionalSearch): Promise<PaginationResult<Food>> {
    const params = this.buildQueryParams(search)
    const url = this.buildUrl('/foods/search/nutrition', params)
    return this.getPaginated<Food>(url, 'Erro na busca nutricional')
  }
}