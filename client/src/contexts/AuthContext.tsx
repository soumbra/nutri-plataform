'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { api } from '@/lib/api'
import { User, LoginData, RegisterData, AuthResponse } from '@/types/auth'

interface AuthContextType {
  readonly user: User | null
  readonly loading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  readonly isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  readonly children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Inicializar autenticação
  useEffect(() => {
    const initAuth = async () => {
      // Verificar localStorage primeiro
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (err: unknown) {
          console.error('Erro ao carregar usuário:', err)
          logout()
        }
      } else {
        // Se não tem no localStorage, verificar se tem cookie (caso de refresh)
        const cookieToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]
        
        if (cookieToken && !token) {
          // Token existe no cookie mas não no localStorage - limpar cookie órfão
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: LoginData) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data)
      const { token, user: userData } = response.data.data

      // Salvar no localStorage E no cookie
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Salvar token no cookie com configurações de segurança
      // Nota: Idealmente seria HttpOnly definido pelo servidor, mas para compatibilidade com middleware
      const isProduction = process.env.NODE_ENV === 'production'
      const secureFlag = isProduction ? '; Secure' : ''
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=strict${secureFlag}`
      
      setUser(userData)
    } catch (err: unknown) {
      // Melhor extração de mensagens de erro do servidor
      let message = 'Credenciais inválidas'
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string, message?: string }, status?: number } }
        if (axiosError.response?.data?.error) {
          message = axiosError.response.data.error
        } else if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message
        } else if (axiosError.response?.status === 401) {
          message = 'Email ou senha incorretos'
        } else if (axiosError.response?.status === 404) {
          message = 'Usuário não encontrado'
        }
      } else if (err instanceof Error) {
        message = err.message
      }
      
      throw new Error(message)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data)
      const { token, user: userData } = response.data.data

      // Salvar no localStorage E no cookie
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Salvar token no cookie com configurações de segurança
      const isProduction = process.env.NODE_ENV === 'production'
      const secureFlag = isProduction ? '; Secure' : ''
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=strict${secureFlag}`
      
      setUser(userData)
    } catch (err: unknown) {
      // Melhor extração de mensagens de erro do servidor
      let message = 'Erro ao registrar'
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string, message?: string }, status?: number } }
        if (axiosError.response?.data?.error) {
          message = axiosError.response.data.error
        } else if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message
        } else if (axiosError.response?.status === 409) {
          message = 'Email já está sendo usado'
        } else if (axiosError.response?.status === 400) {
          message = 'Dados inválidos fornecidos'
        }
      } else if (err instanceof Error) {
        message = err.message
      }
      
      throw new Error(message)
    }
  }

  const logout = () => {
    // Limpar localStorage E cookies
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Limpar cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    setUser(null)
  }

  // Evitar recriar objeto em cada render
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
