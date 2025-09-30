import { api } from './api';
import type { 
  ProgressRecord, 
  ProgressStats, 
  CreateProgressRequest, 
  UpdateProgressRequest,
  ProgressFilters 
} from '@/types/progress';

export const progressService = {
  // Criar registro de progresso
  async create(data: CreateProgressRequest): Promise<ProgressRecord> {
    const response = await api.post('/progress', data);
    return response.data.data;
  },

  // Listar registros do usuário
  async getAll(filters?: ProgressFilters): Promise<ProgressRecord[]> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `/progress?${queryString}` : '/progress';
    
    const response = await api.get(url);
    return response.data.data;
  },

  // Buscar estatísticas
  async getStats(): Promise<ProgressStats> {
    const response = await api.get('/progress/stats');
    return response.data.data;
  },

  // Buscar dados para gráfico
  async getChartData(filters?: ProgressFilters): Promise<ProgressRecord[]> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = queryString ? `/progress/chart?${queryString}` : '/progress/chart';
    
    const response = await api.get(url);
    return response.data.data;
  },

  // Atualizar registro
  async update(id: string, data: UpdateProgressRequest): Promise<ProgressRecord> {
    const response = await api.put(`/progress/${id}`, data);
    return response.data.data;
  },

  // Deletar registro
  async delete(id: string): Promise<void> {
    await api.delete(`/progress/${id}`);
  },

  // Buscar registros de cliente específico (para nutricionistas)
  async getClientProgress(clientId: string, filters?: ProgressFilters): Promise<ProgressRecord[]> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString 
      ? `/progress/client/${clientId}?${queryString}` 
      : `/progress/client/${clientId}`;
    
    const response = await api.get(url);
    return response.data.data;
  }
};