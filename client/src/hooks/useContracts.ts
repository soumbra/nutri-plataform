'use client'
import { useState, useEffect, useCallback } from 'react'
import { Contract } from '@/types/contract'
import { ContractService } from '@/services/contract.service'
import { useCrudStates } from './useBaseHook'

interface UseContractsReturn {
  contracts: Contract[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useContracts(): UseContractsReturn {
  const [contracts, setContracts] = useState<Contract[]>([])
  
  // Usando BaseHook para gerenciar estados
  const { loadingStates, errorStates, executeFetch } = useCrudStates()

  const fetchContracts = useCallback(async (): Promise<void> => {
    await executeFetch(async () => {
      const data = await ContractService.getAll()
      setContracts(data)
      return data
    })
  }, [executeFetch])

  // Criar uma versão estável da função refetch
  const refetch = useCallback(async (): Promise<void> => {
    await fetchContracts()
  }, [fetchContracts])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  return {
    contracts,
    loading: loadingStates.loading,
    error: errorStates.error,
    refetch
  }
}