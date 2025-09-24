'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Nutritionist } from '@/types/nutritionist'
import { NutritionistService } from '@/lib/nutritionist.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Phone, Mail, Star } from 'lucide-react'
import ContractModal from '@/components/ContractModal'

export default function NutritionistProfilePage() {
  const [nutritionist, setNutritionist] = useState<Nutritionist | null>(null)
  const [loading, setLoading] = useState(true)
  const [contractModalOpen, setContractModalOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const loadNutritionist = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const data = await NutritionistService.getById(id)
      setNutritionist(data)
    } catch (error) {
      console.error('Erro ao carregar nutricionista:', error)
      router.push('/nutritionists')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    loadNutritionist()
  }, [loadNutritionist])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Carregando perfil...</div>
      </div>
    )
  }

  if (!nutritionist) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Nutricionista não encontrado</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold">
            {nutritionist.user.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{nutritionist.user.name}</h1>
            <p className="text-muted-foreground mb-2">CRN: {nutritionist.crn}</p>
            {nutritionist.specialty && (
              <Badge variant="secondary" className="mb-2">
                {nutritionist.specialty}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {nutritionist.bio || 'Informações não disponíveis.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experiência e Qualificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-1">Experiência</p>
                  <p className="text-muted-foreground">
                    {nutritionist.experience || 0} anos de prática
                  </p>
                </div>
                
                <div>
                  <p className="font-semibold mb-1">Especialidade</p>
                  <p className="text-muted-foreground">
                    {nutritionist.specialty || 'Nutrição Geral'}
                  </p>
                </div>
                
                <div>
                  <p className="font-semibold mb-1">Registro Profissional</p>
                  <p className="text-muted-foreground">{nutritionist.crn}</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-1">Clientes Ativos</p>
                  <p className="text-muted-foreground">
                    {nutritionist._count.contracts} contratos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contratação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary mb-1">
                  R$ {nutritionist.pricePerHour || 0}
                </p>
                <p className="text-muted-foreground">por sessão</p>
                <p className="text-sm text-muted-foreground mt-1">
                  R$ {((nutritionist.pricePerHour || 0) * 4).toFixed(2)}/mês (4 sessões)
                </p>
              </div>
              
              <Button className="w-full mb-3" size="lg" onClick={() => setContractModalOpen(true)}>
                Contratar Nutricionista
              </Button>
              
              <Button variant="outline" className="w-full">
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nutritionist.user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{nutritionist.user.phone}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{nutritionist.user.email}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="font-semibold">5.0</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Baseado em {nutritionist._count.contracts} avaliações
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Contratação */}
      {nutritionist && (
        <ContractModal
          nutritionist={nutritionist}
          open={contractModalOpen}
          onOpenChange={setContractModalOpen}
        />
      )}
    </div>
  )
}