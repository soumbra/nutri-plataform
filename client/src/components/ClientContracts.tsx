'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, DollarSign, Clock, Trash2 } from 'lucide-react'
import { Contract } from '@/types/contract'
import { useContracts } from '@/hooks/useContracts'
import { ContractService } from '@/lib/contract.service'
import Link from 'next/link'

const statusMap = {
  ACTIVE: { label: 'Ativo', variant: 'default' as const, color: 'text-green-600' },
  PENDING: { label: 'Pendente', variant: 'secondary' as const, color: 'text-yellow-600' },
  COMPLETED: { label: 'Concluído', variant: 'outline' as const, color: 'text-gray-600' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' as const, color: 'text-red-600' },
  PAUSED: { label: 'Pausado', variant: 'secondary' as const, color: 'text-orange-600' }
}

function ContractCard({ contract, onDelete }: { readonly contract: Contract, readonly onDelete: () => void }) {
  const [deleting, setDeleting] = useState(false)
  const status = statusMap[contract.status]
  const sessionsPerMonth = 4
  
  // Calcular total de sessões com validação de datas
  const startDate = contract.startDate ? new Date(contract.startDate) : new Date()
  const endDate = contract.endDate ? new Date(contract.endDate) : new Date()
  const monthsDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const totalSessions = Math.max(monthsDiff * sessionsPerMonth, sessionsPerMonth)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      setDeleting(true)
      await ContractService.delete(contract.id)
      onDelete() // Recarregar a lista
    } catch (error) {
      console.error('Erro ao excluir contrato:', error)
      alert('Erro ao excluir contrato')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate">{contract.nutritionist.user.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {contract.nutritionist.specialty || 'Nutrição Geral'}
              </p>
            </div>
          </div>
          <Badge variant={status.variant} className="text-xs flex-shrink-0">{status.label}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate">Até {contract.endDate ? new Date(contract.endDate).toLocaleDateString('pt-BR') : 'Data indefinida'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span>{totalSessions} sessões</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span>R$ {contract.monthlyPrice.toFixed(2)}/mês</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate">CRN {contract.nutritionist.crn}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
            Ver Planos
          </Button>
          <Button size="sm" className="flex-1 h-7 text-xs">
            Chat
          </Button>
          {/* ⚠️ Botão apenas para desenvolvimento */}
          <Button 
            size="sm" 
            variant="destructive" 
            className="h-7 px-2" 
            onClick={handleDelete}
            disabled={deleting}
            title="Excluir contrato (apenas para testes)"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientContracts() {
  const { contracts, loading, error, refetch } = useContracts()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Nutricionistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div>Carregando contratos...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Nutricionistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-600">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (contracts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Nutricionistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum contrato ativo</h3>
            <p className="text-muted-foreground mb-4">
              Você ainda não contratou nenhum nutricionista
            </p>
            <Link href="/nutritionists">
              <Button>Buscar Nutricionistas</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeContracts = contracts.filter(c => c.status === 'ACTIVE')
  const otherContracts = contracts.filter(c => c.status !== 'ACTIVE')

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Meus Nutricionistas</span>
            <Badge variant="secondary">{contracts.length} contratos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeContracts.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-green-600 text-sm">Contratos Ativos</h4>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {activeContracts.map(contract => (
                  <ContractCard key={contract.id} contract={contract} onDelete={refetch} />
                ))}
              </div>
            </div>
          )}
          
          {otherContracts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground text-sm">Histórico</h4>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {otherContracts.map(contract => (
                  <ContractCard key={contract.id} contract={contract} onDelete={refetch} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}