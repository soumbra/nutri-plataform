'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  
  const role = searchParams.get('role') // client ou nutritionist

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)
      setError('')
      
      await login(data)
      
      // Redirecionar baseado no role
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
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
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
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