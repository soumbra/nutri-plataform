'use client'
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const toast = useToast()
  
  const role = searchParams.get('role') // client ou nutritionist

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      
      await login(data)
      
      setIsLoading(false)
      setIsRedirecting(true)
      toast.success('Login realizado com sucesso!', 'Redirecionando...')
      
      // Aguardar um pouco para o usuário ler o toast antes de redirecionar
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      
      // Mensagens de erro mais específicas
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Credenciais inválidas', 'Email ou senha incorretos')
      } else if (errorMessage.includes('404') || errorMessage.includes('não encontrado')) {
        toast.error('Usuário não encontrado', 'Verifique se o email está correto ou registre-se primeiro')
      } else if (errorMessage.includes('Network Error') || errorMessage.includes('fetch')) {
        toast.error('Erro de conexão', 'Verifique sua conexão com a internet')
      } else {
        toast.error('Erro no login', errorMessage)
      }
      setIsLoading(false)
    }
  }

  const roleTextMap: Record<string, string> = {
  client: 'como Cliente',
  nutritionist: 'como Nutricionista'
  }

  const roleText = roleTextMap[role ?? ''] ?? ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Entrar {roleText}
          </CardTitle>
          <p className="text-muted-foreground">
            Entre com suas credenciais
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isRedirecting}
            >
              {isLoading && 'Entrando...'}
              {isRedirecting && 'Redirecionando...'}
              {!isLoading && !isRedirecting && 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Não tem conta?{' '}
              <Link 
                href={role ? `/register?role=${role}` : '/register'}
                className="text-primary hover:underline"
              >
                Criar conta
              </Link>
            </p>
            
            <p className="mt-2">
              <Link 
                href="/" 
                className="text-muted-foreground hover:underline"
              >
                ← Voltar para início
              </Link>
            </p>
          </div>

          {/* Credenciais de teste */}
          <div className="mt-6 p-4 bg-blue-50 rounded border">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Credenciais para teste:
            </p>
            <p className="text-sm text-blue-700">
              <strong>Nutricionista:</strong> dra.silva@email.com / 123456
            </p>
            <p className="text-sm text-blue-700">
              <strong>Cliente:</strong> joao@email.com / 123456
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Carregando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}