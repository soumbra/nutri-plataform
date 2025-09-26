import { api } from '../lib/api'

// ===== TIPOS COMPARTILHADOS =====
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    pages: number
    current: number
  }
  error?: string
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    total: number
    pages: number
    current: number
  }
}

// ===== ERROR HANDLING =====
interface ApiError {
  response?: {
    data?: {
      error?: string
    }
  }
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'response' in error
}

// ===== BASE SERVICE CLASS =====
export abstract class BaseService {
  /**
   * Constrói query parameters a partir de um objeto de filtros
   */
  protected static buildQueryParams(filters: Record<string, unknown>): URLSearchParams {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Garantir que apenas valores primitivos sejam convertidos
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          params.append(key, value.toString())
        }
      }
    })
    
    return params
  }

  /**
   * Constrói URL com query parameters opcionais
   */
  protected static buildUrl(baseUrl: string, params?: URLSearchParams): string {
    if (!params || params.toString() === '') {
      return baseUrl
    }
    return `${baseUrl}?${params.toString()}`
  }

  /**
   * Faz GET request e retorna dados paginados
   */
  protected static async getPaginated<T>(
    url: string, 
    errorMessage: string = 'Erro ao buscar dados'
  ): Promise<PaginationResult<T>> {
    try {
      const response = await api.get<PaginatedResponse<T>>(url)
      
      if (!response.data.success) {
        throw new Error(response.data.error || errorMessage)
      }

      return {
        data: response.data.data,
        pagination: response.data.pagination
      }
    } catch (error: unknown) {
      throw this.handleError(error, errorMessage)
    }
  }

  /**
   * Faz GET request e retorna um único item
   */
  protected static async getSingle<T>(
    url: string, 
    errorMessage: string = 'Erro ao buscar item'
  ): Promise<T> {
    try {
      const response = await api.get<ApiResponse<T>>(url)
      
      if (!response.data.success) {
        throw new Error(response.data.error || errorMessage)
      }

      return response.data.data
    } catch (error: unknown) {
      throw this.handleError(error, errorMessage)
    }
  }

  /**
   * Faz POST request
   */
  protected static async post<T>(
    url: string, 
    data: unknown, 
    errorMessage: string = 'Erro ao criar item'
  ): Promise<T> {
    try {
      const response = await api.post<ApiResponse<T>>(url, data)
      
      if (!response.data.success) {
        throw new Error(response.data.error || errorMessage)
      }

      return response.data.data
    } catch (error: unknown) {
      throw this.handleError(error, errorMessage)
    }
  }

  /**
   * Faz PUT request
   */
  protected static async put<T>(
    url: string, 
    data: unknown, 
    errorMessage: string = 'Erro ao atualizar item'
  ): Promise<T> {
    try {
      const response = await api.put<ApiResponse<T>>(url, data)
      
      if (!response.data.success) {
        throw new Error(response.data.error || errorMessage)
      }

      return response.data.data
    } catch (error: unknown) {
      throw this.handleError(error, errorMessage)
    }
  }

  /**
   * Faz DELETE request
   */
  protected static async delete(
    url: string, 
    errorMessage: string = 'Erro ao deletar item'
  ): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<null>>(url)
      
      if (!response.data.success) {
        throw new Error(response.data.error || errorMessage)
      }
    } catch (error: unknown) {
      throw this.handleError(error, errorMessage)
    }
  }

  /**
   * Faz GET request que retorna array (não paginado)
   */
  protected static async getArray<T>(
    url: string, 
    errorMessage: string = 'Erro ao buscar dados'
  ): Promise<T[]> {
    try {
      const response = await api.get<ApiResponse<T[]>>(url)
      
      if (!response.data.success) {
        throw new Error(response.data.error || errorMessage)
      }

      return response.data.data
    } catch (error: unknown) {
      throw this.handleError(error, errorMessage)
    }
  }

  /**
   * Tratamento centralizado de erros
   */
  private static handleError(error: unknown, defaultMessage: string): never {
    if (isApiError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    throw new Error(defaultMessage)
  }
}