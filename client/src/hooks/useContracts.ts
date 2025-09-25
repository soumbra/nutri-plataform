'use client'
import { useState, useEffect, useCallback } from 'react'
import { ContractService } from '@/lib/contract.service'
import { Contract } from '@/types/contract'

interface UseContractsReturn {
  contracts: Contract[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useContracts(): UseContractsReturn {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ContractService.getAll()
      setContracts(data)
    } catch (err) {
      console.error('Erro ao carregar contratos:', err)
      setError('Erro ao carregar contratos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts
  }
}