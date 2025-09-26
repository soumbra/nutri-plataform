import { BaseService } from './base.service'
import { Nutritionist, NutritionistFilters } from '@/types/nutritionist'

export class NutritionistService extends BaseService {
  static async getAll(filters: NutritionistFilters = {}): Promise<Nutritionist[]> {
    const params = this.buildQueryParams(filters)
    const url = this.buildUrl('/nutritionists', params)
    return this.getArray<Nutritionist>(url, 'Erro ao buscar nutricionistas')
  }

  static async getById(id: string): Promise<Nutritionist> {
    return this.getSingle<Nutritionist>(`/nutritionists/${id}`, 'Nutricionista não encontrado')
  }

  static async getSpecialties(): Promise<string[]> {
    return this.getArray<string>('/nutritionists/specialties', 'Erro ao buscar especialidades')
  }
}