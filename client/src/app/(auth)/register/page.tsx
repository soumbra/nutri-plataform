'use client'
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react'
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

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['CLIENT', 'NUTRITIONIST']),
  phone: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword']
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register: registerUser } = useAuth()
  
  const roleParam = searchParams.get('role') // client ou nutritionist
                     
  const roleMap: Record<string, 'CLIENT' | 'NUTRITIONIST'> = {
    client: 'CLIENT',
    nutritionist: 'NUTRITIONIST'
  }

  const defaultRole = roleMap[roleParam ?? ''] ?? 'CLIENT'

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole
    }
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError('')
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data
      await registerUser(registerData)
      
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <p className="text-muted-foreground">
            Preencha seus dados para começar
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Seletor de Tipo */}
            <div className="space-y-2">
              <Label>Eu sou:</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedRole === 'CLIENT' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setValue('role', 'CLIENT')}
                >
                  Cliente
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'NUTRITIONIST' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setValue('role', 'NUTRITIONIST')}
                >
                  Nutricionista
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

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
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                {...register('phone')}
              />
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Já tem conta?{' '}
              <Link 
                href={roleParam ? `/login?role=${roleParam}` : '/login'}
                className="text-primary hover:underline"
              >
                Fazer login
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
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Carregando...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}