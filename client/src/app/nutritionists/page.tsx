'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react'
import { Nutritionist, NutritionistFilters } from '@/types/nutritionist'
import { NutritionistService } from '@/services/nutritionist.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NutritionistsPage() {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([])
  const [loading, setLoading] = useState(true)
  const [appliedFilters, setAppliedFilters] = useState<NutritionistFilters>({})
  const [formFilters, setFormFilters] = useState<NutritionistFilters>({})
  const [specialties, setSpecialties] = useState<string[]>([])

  const loadNutritionists = useCallback(async () => {
    try {
      setLoading(true)
      const data = await NutritionistService.getAll(appliedFilters)
      setNutritionists(data)
    } catch (error) {
      console.error('Erro ao carregar nutricionistas:', error)
    } finally {
      setLoading(false)
    }
  }, [appliedFilters])

  useEffect(() => {
    loadNutritionists()
    loadSpecialties()
  }, [loadNutritionists])

  const loadSpecialties = async () => {
    try {
      const data = await NutritionistService.getSpecialties()
      setSpecialties(data)
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error)
    }
  }

  const handleSearch = () => {
    setAppliedFilters(formFilters)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Carregando nutricionistas...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Encontre seu Nutricionista</h1>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Buscar por nome..."
          value={formFilters.search || ''}
          onChange={(e) => setFormFilters({...formFilters, search: e.target.value})}
          onKeyDown={handleKeyDown}
        />
        
        <select 
          className="border rounded px-3 py-2"
          value={formFilters.specialty || ''}
          onChange={(e) => setFormFilters({...formFilters, specialty: e.target.value || undefined})}
          onKeyDown={handleKeyDown}
        >
          <option value="">Todas especialidades</option>
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>

        <Input
          type="number"
          placeholder="Preço máximo"
          value={formFilters.maxPrice || ''}
          onChange={(e) => setFormFilters({...formFilters, maxPrice: Number(e.target.value) || undefined})}
          onKeyDown={handleKeyDown}
        />

        <Button onClick={handleSearch}>
          Buscar
        </Button>
      </div>

      {/* Lista de Nutricionistas*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nutritionists.map((nutritionist) => (
          <Card key={nutritionist.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {nutritionist.user.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-lg">{nutritionist.user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">CRN: {nutritionist.crn}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {nutritionist.specialty && (
                <Badge variant="secondary" className="mb-3 w-fit">
                  {nutritionist.specialty}
                </Badge>
              )}
              
              <div className="flex-1 mb-4">
                <p className="text-sm text-muted-foreground line-clamp-4 h-20 overflow-hidden">
                  {nutritionist.bio}
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Experiência</p>
                  <p className="font-semibold">{nutritionist.experience || 0} anos</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor/hora</p>
                  <p className="font-semibold">R$ {nutritionist.pricePerHour || 0}</p>
                </div>
              </div>
              
              <Link href={`/nutritionists/${nutritionist.id}`}>
                <Button className="w-full mt-auto">
                  Ver Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {nutritionists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum nutricionista encontrado</p>
        </div>
      )}
    </div>
  )
}