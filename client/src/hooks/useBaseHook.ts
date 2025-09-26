'use client'
import { useState, useCallback } from 'react'

// ===== TIPOS BÁSICOS =====
export interface BaseLoadingStates {
  loading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
}

export interface BaseErrorStates {
  error: string | null
  createError: string | null
  updateError: string | null
  deleteError: string | null
}

export interface AsyncOperationConfig {
  loadingState: keyof BaseLoadingStates
  errorState: keyof BaseErrorStates
  defaultErrorMessage: string
}

// ===== BASE HOOK RETURN TYPE =====
export interface BaseHookReturn {
  // Estados de loading
  loadingStates: BaseLoadingStates
  setLoadingState: (state: keyof BaseLoadingStates, value: boolean) => void
  
  // Estados de error
  errorStates: BaseErrorStates
  setErrorState: (state: keyof BaseErrorStates, message: string | null) => void
  
  // Helpers
  handleError: (err: unknown, defaultMessage: string) => string
  clearErrors: () => void
  clearError: (errorState: keyof BaseErrorStates) => void
  executeWithStates: <T>(
    operation: () => Promise<T>,
    config: AsyncOperationConfig
  ) => Promise<T | null>
}

// ===== BASE HOOK IMPLEMENTATION =====
export function useBaseHook(): BaseHookReturn {
  // ===== ESTADOS DE LOADING =====
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ===== ESTADOS DE ERROR =====
  const [error, setError] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // ===== OBJETOS DE ESTADO =====
  const loadingStates: BaseLoadingStates = {
    loading,
    creating,
    updating,
    deleting
  }

  const errorStates: BaseErrorStates = {
    error,
    createError,
    updateError,
    deleteError
  }

  // ===== SETTERS PARA LOADING STATES =====
  const setLoadingState = useCallback((state: keyof BaseLoadingStates, value: boolean) => {
    switch (state) {
      case 'loading':
        setLoading(value)
        break
      case 'creating':
        setCreating(value)
        break
      case 'updating':
        setUpdating(value)
        break
      case 'deleting':
        setDeleting(value)
        break
    }
  }, [])

  // ===== SETTERS PARA ERROR STATES =====
  const setErrorState = useCallback((state: keyof BaseErrorStates, message: string | null) => {
    switch (state) {
      case 'error':
        setError(message)
        break
      case 'createError':
        setCreateError(message)
        break
      case 'updateError':
        setUpdateError(message)
        break
      case 'deleteError':
        setDeleteError(message)
        break
    }
  }, [])

  // ===== HELPER PARA EXTRAIR MENSAGEM DE ERRO =====
  const handleError = useCallback((err: unknown, defaultMessage: string): string => {
    return err instanceof Error ? err.message : defaultMessage
  }, [])

  // ===== LIMPAR TODOS OS ERROS =====
  const clearErrors = useCallback(() => {
    setError(null)
    setCreateError(null)
    setUpdateError(null)
    setDeleteError(null)
  }, [])

  // ===== LIMPAR ERRO ESPECÍFICO =====
  const clearError = useCallback((errorState: keyof BaseErrorStates) => {
    setErrorState(errorState, null)
  }, [setErrorState])

  // ===== EXECUTAR OPERAÇÃO COM GERENCIAMENTO DE ESTADOS =====
  const executeWithStates = useCallback(async <T>(
    operation: () => Promise<T>,
    config: AsyncOperationConfig
  ): Promise<T | null> => {
    try {
      setLoadingState(config.loadingState, true)
      setErrorState(config.errorState, null)
      
      const result = await operation()
      return result
    } catch (err) {
      const errorMessage = handleError(err, config.defaultErrorMessage)
      setErrorState(config.errorState, errorMessage)
      console.error(`${config.defaultErrorMessage}:`, err)
      return null
    } finally {
      setLoadingState(config.loadingState, false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // ===== RETURN =====
  return {
    // Estados
    loadingStates,
    errorStates,
    
    // Setters
    setLoadingState,
    setErrorState,
    
    // Helpers
    handleError,
    clearErrors,
    clearError,
    executeWithStates
  }
}

// ===== HELPER HOOKS ESPECÍFICOS =====

// Hook para operações CRUD básicas
export function useCrudStates() {
  const {
    loadingStates,
    errorStates,
    setLoadingState,
    setErrorState,
    handleError,
    clearErrors,
    clearError,
    executeWithStates
  } = useBaseHook()
  
  // Funções CRUD estáveis
  const executeFetch = useCallback(<T>(operation: () => Promise<T>) => 
    executeWithStates(operation, {
      loadingState: 'loading',
      errorState: 'error',
      defaultErrorMessage: 'Erro ao carregar dados'
    }), [executeWithStates])
  
  const executeCreate = useCallback(<T>(operation: () => Promise<T>) =>
    executeWithStates(operation, {
      loadingState: 'creating',
      errorState: 'createError', 
      defaultErrorMessage: 'Erro ao criar item'
    }), [executeWithStates])
  
  const executeUpdate = useCallback(<T>(operation: () => Promise<T>) =>
    executeWithStates(operation, {
      loadingState: 'updating',
      errorState: 'updateError',
      defaultErrorMessage: 'Erro ao atualizar item'
    }), [executeWithStates])
  
  const executeDelete = useCallback(<T>(operation: () => Promise<T>) =>
    executeWithStates(operation, {
      loadingState: 'deleting',
      errorState: 'deleteError',
      defaultErrorMessage: 'Erro ao deletar item'
    }), [executeWithStates])
  
  return {
    loadingStates,
    errorStates,
    setLoadingState,
    setErrorState,
    handleError,
    clearErrors,
    clearError,
    executeWithStates,
    executeFetch,
    executeCreate,
    executeUpdate,
    executeDelete
  }
}