import { api } from './api'
import { Contract, CreateContractData, ContractFilters, UpdateContractStatusData } from '@/types/contract'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

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

export class ContractService {
  static async create(data: CreateContractData): Promise<Contract> {
    try {
      const response = await api.post<ApiResponse<Contract>>('/contracts', data)
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao criar contrato')
      }

      return response.data.data
    } catch (error: unknown) {
      if (isApiError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Erro ao criar contrato')
    }
  }

  static async getAll(filters: ContractFilters = {}): Promise<Contract[]> {
    try {
      const params = new URLSearchParams()
      
      if (filters.status) {
        params.append('status', filters.status)
      }
      if (filters.clientId) {
        params.append('clientId', filters.clientId)
      }
      if (filters.nutritionistId) {
        params.append('nutritionistId', filters.nutritionistId)
      }

      const url = params.toString() ? `/contracts?${params.toString()}` : '/contracts'
      const response = await api.get<ApiResponse<Contract[]>>(url)

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao buscar contratos')
      }

      return response.data.data
    } catch (error: unknown) {
      if (isApiError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Erro ao buscar contratos')
    }
  }

  static async getById(id: string): Promise<Contract> {
    try {
      const response = await api.get<ApiResponse<Contract>>(`/contracts/${id}`)

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao buscar contrato')
      }

      return response.data.data
    } catch (error: unknown) {
      if (isApiError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Contrato não encontrado')
    }
  }

  static async updateStatus(id: string, data: UpdateContractStatusData): Promise<Contract> {
    try {
      const response = await api.patch<ApiResponse<Contract>>(`/contracts/${id}/status`, data)

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao atualizar status do contrato')
      }

      return response.data.data
    } catch (error: unknown) {
      if (isApiError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Erro ao atualizar status do contrato')
    }
  }

  // ⚠️ APENAS PARA DESENVOLVIMENTO - Remover em produção
  static async delete(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/contracts/${id}`)

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao excluir contrato')
      }
    } catch (error: unknown) {
      if (isApiError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Erro ao excluir contrato')
    }
  }

  // Helpers para status
  static getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      ACTIVE: 'Ativo',
      PAUSED: 'Pausado',
      CANCELLED: 'Cancelado',
      COMPLETED: 'Finalizado'
    }
    return statusMap[status] || status
  }

  static getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      PAUSED: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }
}