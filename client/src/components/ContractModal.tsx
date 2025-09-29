'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Clock } from 'lucide-react'
import { Nutritionist } from '@/types/nutritionist'
import { ContractService } from '@/services/contract.service'
import { useRouter } from 'next/navigation'

interface ContractModalProps {
  readonly nutritionist: Nutritionist
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export default function ContractModal({ nutritionist, open, onOpenChange }: ContractModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details')
  const [duration, setDuration] = useState('1') // em meses
  const router = useRouter()

  // Calcular preço mensal baseado no preço por hora (4 sessões por mês)
  const sessionsPerMonth = 4
  const pricePerSession = nutritionist.pricePerHour || 0
  const monthlyPrice = pricePerSession * sessionsPerMonth
  const totalPrice = monthlyPrice * parseInt(duration)
  const totalSessions = sessionsPerMonth * parseInt(duration)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError('')

      // Calcular data de fim
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + parseInt(duration))

      const contractData = {
        nutritionistId: nutritionist.id,
        monthlyPrice: monthlyPrice,
        endDate: endDate.toISOString()
      }

      await ContractService.create(contractData)
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar contrato')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (step === 'success') {
      router.push('/dashboard')
    }
    onOpenChange(false)
    setStep('details')
    setError('')
    setDuration('1')
  }

  const renderDetailsStep = () => (
    <div className="space-y-6">
      {/* Informações do Nutricionista */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {nutritionist.user.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">{nutritionist.user.name}</div>
              <div className="text-sm text-muted-foreground">CRN: {nutritionist.crn}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {nutritionist.specialty && (
            <Badge variant="secondary" className="mb-2">
              {nutritionist.specialty}
            </Badge>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {nutritionist.bio}
          </p>
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {nutritionist.experience || 0} anos
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              R$ {nutritionist.pricePerHour || 0}/consulta
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Contrato */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="duration">Duração do contrato</Label>
          <select
            id="duration"
            className="w-full border rounded-md px-3 py-2 mt-1 bg-background"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="1">1 mês</option>
            <option value="3">3 meses</option>
            <option value="6">6 meses</option>
            <option value="12">12 meses</option>
          </select>
        </div>

        {/* Resumo */}
        <div className="bg-muted/30 p-3 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Valor/sessão:</span>
            <span className="font-medium">R$ {pricePerSession.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{sessionsPerMonth} sessões/mês:</span>
            <span className="font-medium">R$ {monthlyPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Duração:</span>
            <span>{duration} {parseInt(duration) === 1 ? 'mês' : 'meses'}</span>
          </div>
          <div className="flex justify-between">
            <span>Total sessões:</span>
            <span>{totalSessions} sessões</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span className="text-primary">R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" size="sm">
          Cancelar
        </Button>
        <Button 
          onClick={() => setStep('confirm')} 
          className="flex-1"
          disabled={loading}
          size="sm"
        >
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderConfirmStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Confirme os detalhes do seu contrato
      </p>

      <div className="bg-muted/30 p-3 rounded-lg space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Nutricionista:</span>
          <span className="font-medium">{nutritionist.user.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Especialidade:</span>
          <span>{nutritionist.specialty || 'Geral'}</span>
        </div>
        <div className="flex justify-between">
          <span>Sessões:</span>
          <span>{totalSessions} sessões ({sessionsPerMonth}/mês)</span>
        </div>
        <div className="flex justify-between">
          <span>Duração:</span>
          <span>{duration} {parseInt(duration) === 1 ? 'mês' : 'meses'}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold text-base">
          <span>Total:</span>
          <span className="text-primary">R$ {totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-xs">
        <strong>Incluído:</strong> {totalSessions} sessões individuais 
        ({sessionsPerMonth}/mês × {duration} {parseInt(duration) === 1 ? 'mês' : 'meses'})
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={() => setStep('details')} className="flex-1" size="sm">
          Voltar
        </Button>
        <Button 
          onClick={handleConfirm} 
          className="flex-1"
          disabled={loading}
          size="sm"
        >
          {loading ? 'Confirmando...' : 'Confirmar'}
        </Button>
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="space-y-3 text-center">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-xl">
        ✓
      </div>
      
      <div>
        <h3 className="font-semibold mb-1">Contrato criado!</h3>
        <p className="text-sm text-muted-foreground">
          Seu contrato com {nutritionist.user.name} foi confirmado.
        </p>
      </div>
      
      <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded text-sm">
        Você pode acompanhar o progresso no dashboard.
      </div>

      <Button onClick={handleClose} className="w-full" size="sm">
        Ir para Dashboard
      </Button>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle>
            {step === 'details' && 'Contratar Nutricionista'}
            {step === 'confirm' && 'Confirmar Contrato'}
            {step === 'success' && 'Contrato Criado!'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'details' && renderDetailsStep()}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  )
}