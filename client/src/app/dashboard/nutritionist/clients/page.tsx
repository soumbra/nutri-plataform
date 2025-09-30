'use client'
export const dynamic = 'force-dynamic';

import { useState, useMemo, Suspense } from 'react'
import { Plus, Search, Users, TrendingUp, Eye, Calendar, Clock, User, ChefHat, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useContracts } from '@/hooks/useContracts'
import { Contract } from '@/types/contract'
import Link from 'next/link'

// Status mapping
const statusMap = {
  ACTIVE: { label: 'Ativo', variant: 'default' as const, color: 'bg-green-500' },
  PENDING: { label: 'Pendente', variant: 'secondary' as const, color: 'bg-yellow-500' },
  PAUSED: { label: 'Pausado', variant: 'outline' as const, color: 'bg-orange-500' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' as const, color: 'bg-red-500' },
  COMPLETED: { label: 'Concluído', variant: 'outline' as const, color: 'bg-gray-500' }
}

function ClientsContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const { contracts, loading, error } = useContracts()

  // Filtrar contratos
  const filteredContracts = useMemo(() => {
    let filtered = contracts

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(contract =>
        contract.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.client.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtro por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(contract => contract.status === selectedStatus)
    }

    return filtered
  }, [contracts, searchQuery, selectedStatus])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const total = contracts.length
    const active = contracts.filter(c => c.status === 'ACTIVE').length
    const withPlans = contracts.filter(c => c.mealPlans && c.mealPlans.length > 0).length
    const withoutPlans = total - withPlans

    return { total, active, withPlans, withoutPlans }
  }, [contracts])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar clientes</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meus Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie seus contratos e acompanhe o progresso dos clientes
            </p>
          </div>
        </div>
        <Link href="/dashboard/nutritionist/meal-plans/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              contratos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Planos</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withPlans}</div>
            <p className="text-xs text-muted-foreground">
              planos criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Planos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withoutPlans}</div>
            <p className="text-xs text-muted-foreground">
              necessitam atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email do cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">Todos os Status</option>
          <option value="ACTIVE">Ativos</option>
          <option value="PENDING">Pendentes</option>
          <option value="PAUSED">Pausados</option>
          <option value="COMPLETED">Concluídos</option>
        </select>
      </div>

      {/* Lista de Clientes */}
      {filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedStatus !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Você ainda não possui clientes contratados'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredContracts.map((contract) => (
            <ClientCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  )
}

function ClientCard({ contract }: { readonly contract: Contract }) {
  const status = statusMap[contract.status]
  const planCount = contract.mealPlans?.length || 0
  const hasPlans = planCount > 0

  return (
    <Card className="hover:shadow-md transition-shadow h-[200px] flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header com avatar, nome e status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate">{contract.client.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{contract.client.email}</p>
            </div>
          </div>
          <Badge variant={status.variant} className="text-xs flex-shrink-0">{status.label}</Badge>
        </div>

        {/* Informações do contrato */}
        <div className="space-y-2 mb-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{new Date(contract.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span>R$ {contract.monthlyPrice.toFixed(2)}/mês</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ChefHat className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Planos:</span>
            </div>
            <Badge 
              variant={hasPlans ? "default" : "secondary"} 
              className={`text-xs ${!hasPlans ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}`}
            >
              {planCount} {planCount === 1 ? 'plano' : 'planos'}
            </Badge>
          </div>
        </div>

        {/* Spacer para empurrar botões para baixo */}
        <div className="flex-1"></div>

        {/* Botões fixos na parte inferior */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/dashboard/nutritionist/meal-plans?clientId=${contract.client.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-7 text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Ver Planos
            </Button>
          </Link>
          <Link href={`/dashboard/nutritionist/meal-plans/new?contractId=${contract.id}`} className="flex-1">
            <Button size="sm" className="w-full h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Criar Plano
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    }>
      <ClientsContent />
    </Suspense>
  )
}