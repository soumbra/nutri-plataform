import { api } from './api'
import { Nutritionist, NutritionistFilters } from '@/types/nutritionist'

interface NutritionistResponse {
  success: boolean
  data: Nutritionist[]
}

interface SingleNutritionistResponse {
  success: boolean
  data: Nutritionist
}

interface SpecialtiesResponse {
  success: boolean
  data: string[]
}

export class NutritionistService {
  static async getAll(filters: NutritionistFilters = {}): Promise<Nutritionist[]> {
    const params = new URLSearchParams()
    
    if (filters.specialty) params.append('specialty', filters.specialty)
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.experience) params.append('experience', filters.experience.toString())
    if (filters.search) params.append('search', filters.search)

    const response = await api.get<NutritionistResponse>(`/nutritionists?${params}`)
    return response.data.data
  }

  static async getById(id: string): Promise<Nutritionist> {
    const response = await api.get<SingleNutritionistResponse>(`/nutritionists/${id}`)
    return response.data.data
  }

  static async getSpecialties(): Promise<string[]> {
    const response = await api.get<SpecialtiesResponse>('/nutritionists/specialties')
    return response.data.data
  }
}