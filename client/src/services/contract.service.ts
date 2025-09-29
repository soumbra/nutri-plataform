import { BaseService } from './base.service'
import { Contract, CreateContractData, ContractFilters, UpdateContractStatusData } from '@/types/contract'

export class ContractService extends BaseService {
  static async create(data: CreateContractData): Promise<Contract> {
    return this.post<Contract>('/contracts', data, 'Erro ao criar contrato')
  }

  static async getAll(filters: ContractFilters = {}): Promise<Contract[]> {
    const params = this.buildQueryParams(filters)
    const url = this.buildUrl('/contracts', params)
    return this.getArray<Contract>(url, 'Erro ao buscar contratos')
  }

  static async getById(id: string): Promise<Contract> {
    return this.getSingle<Contract>(`/contracts/${id}`, 'Contrato não encontrado')
  }

  static async updateStatus(id: string, data: UpdateContractStatusData): Promise<Contract> {
    return this.put<Contract>(`/contracts/${id}/status`, data, 'Erro ao atualizar status do contrato')
  }

  // ⚠️ APENAS PARA DESENVOLVIMENTO - Remover em produção
  static async delete(id: string): Promise<void> {
    return super.delete(`/contracts/${id}`, 'Erro ao excluir contrato')
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