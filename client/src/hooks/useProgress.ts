'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { progressService } from '@/lib/progress';
import type { 
  ProgressRecord, 
  ProgressStats, 
  CreateProgressRequest, 
  UpdateProgressRequest,
  ProgressFilters 
} from '@/types/progress';

export function useProgress(filters?: ProgressFilters) {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [chartData, setChartData] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para evitar chamadas duplicadas
  const isLoading = useRef(false);

  // Carregar dados iniciais
  const fetchData = useCallback(async () => {
    // Evitar chamadas simultâneas
    if (isLoading.current) {
      return;
    }
    
    try {
      isLoading.current = true;
      setLoading(true);
      setError(null);
      
      const [recordsData, statsData, chartDataRes] = await Promise.all([
        progressService.getAll(filters),
        progressService.getStats(),
        progressService.getChartData(filters)
      ]);

      setRecords(recordsData);
      setStats(statsData);
      setChartData(chartDataRes);
    } catch (err) {
      setError('Erro ao carregar dados de progresso');
      console.error('Error fetching progress data:', err);
    } finally {
      setLoading(false);
      isLoading.current = false;
    }
  }, [filters]);

  // Criar novo registro
  const createRecord = async (data: CreateProgressRequest) => {
    try {
      const newRecord = await progressService.create(data);
      
      // Recarregar todos os dados para garantir consistência
      await fetchData();
      
      return newRecord;
    } catch (err) {
      console.error('Error creating progress record:', err);
      throw err;
    }
  };

  // Atualizar registro
  const updateRecord = async (id: string, data: UpdateProgressRequest) => {
    try {
      const updatedRecord = await progressService.update(id, data);
      
      // Recarregar todos os dados para garantir consistência
      await fetchData();
      
      return updatedRecord;
    } catch (err) {
      console.error('Error updating progress record:', err);
      throw err;
    }
  };

  // Deletar registro
  const deleteRecord = async (id: string) => {
    try {
      await progressService.delete(id);
      
      // Recarregar todos os dados para garantir consistência
      await fetchData();
    } catch (err) {
      console.error('Error deleting progress record:', err);
      throw err;
    }
  };

  // Recarregar dados
  const refresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    records,
    stats,
    chartData,
    loading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    refresh
  };
}

// Hook específico para nutricionistas visualizarem progresso de clientes
export function useClientProgress(clientId: string, filters?: ProgressFilters) {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientData = useCallback(async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const recordsData = await progressService.getClientProgress(clientId, filters);
      setRecords(recordsData);
    } catch (err) {
      setError('Erro ao carregar dados do cliente');
      console.error('Error fetching client progress data:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId, filters]);

  const refresh = () => {
    fetchClientData();
  };

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  return {
    records,
    loading,
    error,
    refresh
  };
}