'use client'

import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react'
import { X, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import './toast.css'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

interface ToastItemProps {
  readonly toast: Toast
  readonly onRemove: (id: string) => void
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration || 5000)
      
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <div className="bg-green-100 rounded-full p-1">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        )
      case 'error':
        return (
          <div className="bg-red-100 rounded-full p-1">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
        )
      case 'warning':
        return (
          <div className="bg-yellow-100 rounded-full p-1">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
        )
      case 'info':
        return (
          <div className="bg-blue-100 rounded-full p-1">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
        )
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-white border-green-300 toast-shadow-green'
      case 'error':
        return 'bg-white border-red-300 toast-shadow-red'
      case 'warning':
        return 'bg-white border-yellow-300 toast-shadow-yellow'
      case 'info':
        return 'bg-white border-blue-300 toast-shadow-blue'
    }
  }

  const getTextColors = () => {
    switch (toast.type) {
      case 'success':
        return { title: 'text-green-800', description: 'text-green-700' }
      case 'error':
        return { title: 'text-red-800', description: 'text-red-700' }
      case 'warning':
        return { title: 'text-yellow-800', description: 'text-yellow-700' }
      case 'info':
        return { title: 'text-blue-800', description: 'text-blue-700' }
    }
  }

  const colors = getTextColors()

  return (
    <div 
      className={`max-w-sm w-full border-2 rounded-xl backdrop-blur-sm transform transition-all duration-300 ease-in-out toast-enter ${getBgColor()}`}
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-tight ${colors.title}`}>
            {toast.title}
          </p>
          {toast.description && (
            <p className={`mt-1 text-sm leading-tight ${colors.description}`}>
              {toast.description}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            className="bg-gray-100/80 hover:bg-gray-200/80 rounded-md inline-flex text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1.5 transition-colors"
            onClick={() => onRemove(toast.id)}
            aria-label="Fechar notificação"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Context e Provider para toasts
interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  readonly children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
  }, [])

  const success = useCallback((title: string, description?: string) => {
    showToast({ 
      type: 'success', 
      title: String(title || 'Sucesso'), 
      description: description ? String(description) : undefined 
    })
  }, [showToast])

  const error = useCallback((title: string, description?: string) => {
    showToast({ 
      type: 'error', 
      title: String(title || 'Erro'), 
      description: description ? String(description) : undefined, 
      duration: 0 
    }) // Erros não desaparecem automaticamente
  }, [showToast])

  const warning = useCallback((title: string, description?: string) => {
    showToast({ 
      type: 'warning', 
      title: String(title || 'Aviso'), 
      description: description ? String(description) : undefined 
    })
  }, [showToast])

  const info = useCallback((title: string, description?: string) => {
    showToast({ 
      type: 'info', 
      title: String(title || 'Informação'), 
      description: description ? String(description) : undefined 
    })
  }, [showToast])

  const contextValue = useMemo(() => ({
    showToast,
    success,
    error,
    warning,
    info
  }), [showToast, success, error, warning, info])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed top-4 right-4 space-y-3 pointer-events-none max-w-sm"
        style={{ 
          zIndex: 9999
        }}
      >
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto transform transition-all duration-300 ease-in-out"
            style={{
              transform: `translateY(${index * 8}px)`,
              zIndex: 9999 - index
            }}
          >
            <ToastItem
              toast={toast}
              onRemove={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}