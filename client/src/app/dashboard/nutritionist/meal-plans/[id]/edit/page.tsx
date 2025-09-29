'use client'

import { use, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useMealPlans } from '@/hooks/useMealPlans'
import { useFoods } from '@/hooks/useFoods'
import { UpdateMealPlanData } from '@/services/meal-plan.service'
import { Food } from '@/services/food.service'
import { useToast } from '@/components/ui/toast'

interface MealFormData {
  id?: string
  name: string
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'
  time?: string
  foods: Array<{
    food: Food
    quantity: number
    unit: string
  }>
}

interface FormData {
  title: string
  description: string
  startDate: string
  endDate: string
  meals: MealFormData[]
}

const MEAL_TYPES = [
  { value: 'BREAKFAST', label: 'Café da Manhã' },
  { value: 'LUNCH', label: 'Almoço' },
  { value: 'DINNER', label: 'Jantar' },
  { value: 'SNACK', label: 'Lanche' }
] as const

interface EditMealPlanPageProps {
  readonly params: Promise<{
    readonly id: string
  }>
}

export default function EditMealPlanPage({ params }: EditMealPlanPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const toast = useToast()
  const { currentPlan, fetchPlanById, updatePlan, updating: loading, loading: loadingPlan } = useMealPlans()
  const { 
    foods, 
    searchFoods, 
    loading: foodsLoading 
  } = useFoods({
    autoFetch: false
  })
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    meals: []
  })
  
  // Guardar estado original das refeições para comparação
  const [originalMeals, setOriginalMeals] = useState<MealFormData[]>([])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null)
  const [foodDialogOpen, setFoodDialogOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Carrega o plano alimentar quando a página é montada
  useEffect(() => {
    if (resolvedParams.id) {
      fetchPlanById(resolvedParams.id)
    }
  }, [resolvedParams.id, fetchPlanById])

  // Popula o formulário quando o plano é carregado
  useEffect(() => {
    if (currentPlan && !isInitialized) {
      const meals: MealFormData[] = currentPlan.meals?.map(meal => ({
        id: meal.id,
        name: meal.name,
        type: meal.type,
        time: meal.suggestedTime || '',
        foods: meal.foods?.map(mealFood => {
          const food = mealFood.food as Food
          return {
            food: {
              id: food.id,
              name: food.name,
              category: food.category,
              calories: food.calories || 0,
              proteins: food.proteins || 0,
              carbs: food.carbs || 0,
              fats: food.fats || 0,
              fiber: food.fiber || 0,
              createdAt: food.createdAt || '',
              updatedAt: food.updatedAt || ''
            },
            quantity: mealFood.quantity,
            unit: 'g'
          }
        }) || []
      })) || []

      setFormData({
        title: currentPlan.title, // MealPlan tem 'title', não 'name'
        description: currentPlan.description || '',
        startDate: currentPlan.startDate.split('T')[0], // Convert ISO date to YYYY-MM-DD
        endDate: currentPlan.endDate.split('T')[0],
        meals
      })
      
      // Guardar estado original para comparação
      setOriginalMeals(JSON.parse(JSON.stringify(meals))) // Deep copy
      
      setIsInitialized(true)
    }
  }, [currentPlan, isInitialized])

  const handleInputChange = useCallback((field: keyof Omit<FormData, 'meals'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const addMeal = useCallback(() => {
    const newMeal: MealFormData = {
      name: '',
      type: 'BREAKFAST',
      time: '',
      foods: []
    }
    
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, newMeal]
    }))
  }, [])

  const removeMeal = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }))
  }, [])

  const updateMeal = useCallback((index: number, field: keyof MealFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.map((meal, i) => 
        i === index ? { ...meal, [field]: value } : meal
      )
    }))
  }, [])

  const addFoodToMeal = useCallback((mealIndex: number, food: Food) => {
    const newFood = {
      food,
      quantity: 100,
      unit: 'g'
    }

    setFormData(prev => ({
      ...prev,
      meals: prev.meals.map((meal, i) => 
        i === mealIndex 
          ? { ...meal, foods: [...meal.foods, newFood] }
          : meal
      )
    }))
    
    setFoodDialogOpen(false)
    setSearchTerm('')
  }, [])

  // Helper functions to reduce nesting
  const filterFoodFromMeal = (foods: Array<{food: Food; quantity: number; unit: string}>, foodIndex: number) => {
    return foods.filter((_, fi) => fi !== foodIndex)
  }

  const removeFoodFromMeal = useCallback((mealIndex: number, foodIndex: number) => {
    const updateMeals = (meals: MealFormData[]) => 
      meals.map((meal, i) => {
        if (i === mealIndex) {
          return { ...meal, foods: filterFoodFromMeal(meal.foods, foodIndex) }
        }
        return meal
      })
    
    setFormData(prev => ({
      ...prev,
      meals: updateMeals(prev.meals)
    }))
  }, [])

  const updateFoodInMealHelper = (foods: Array<{food: Food; quantity: number; unit: string}>, foodIndex: number, quantity: number) => {
    return foods.map((food, fi) => fi === foodIndex ? { ...food, quantity } : food)
  }

  const updateFoodQuantity = useCallback((mealIndex: number, foodIndex: number, quantity: number) => {    
    const updateMeals = (meals: MealFormData[]) => 
      meals.map((meal, i) => {
        if (i === mealIndex) {
          return { ...meal, foods: updateFoodInMealHelper(meal.foods, foodIndex, quantity) }
        }
        return meal
      })
    
    setFormData(prev => ({
      ...prev,
      meals: updateMeals(prev.meals)
    }))
  }, [])

  const calculateMealNutrition = useCallback((meal: MealFormData) => {
    return meal.foods.reduce((total, { food, quantity }) => {
      const factor = quantity / 100 // Assumindo que os valores nutricionais são por 100g
      return {
        calories: total.calories + (food.calories * factor),
        proteins: total.proteins + (food.proteins * factor),
        carbs: total.carbs + (food.carbs * factor),
        fats: total.fats + (food.fats * factor),
        fiber: total.fiber + (food.fiber * factor)
      }
    }, { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 })
  }, [])

  const calculateTotalNutrition = useCallback(() => {
    return formData.meals.reduce((total, meal) => {
      const mealNutrition = calculateMealNutrition(meal)
      return {
        calories: total.calories + mealNutrition.calories,
        proteins: total.proteins + mealNutrition.proteins,
        carbs: total.carbs + mealNutrition.carbs,
        fats: total.fats + mealNutrition.fats,
        fiber: total.fiber + mealNutrition.fiber
      }
    }, { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 })
  }, [formData.meals, calculateMealNutrition])

  // Helper para renderizar a lista de alimentos
  const renderFoodsList = useCallback((foods: Food[], mealIndex: number, searchTerm: string, foodsLoading: boolean) => {
    if (foodsLoading) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
          Buscando alimentos...
        </div>
      )
    }
    
    // Se tem termo mas é muito curto
    if (searchTerm.trim() && searchTerm.trim().length < 3) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          Digite pelo menos 3 letras para buscar
        </div>
      )
    }
    
    if (foods.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          {searchTerm.trim().length >= 3 ? 'Nenhum alimento encontrado' : 'Digite pelo menos 3 letras para buscar alimentos'}
        </div>
      )
    }
    
    return foods.map((food) => (
      <button
        key={food.id}
        type="button"
        className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => addFoodToMeal(mealIndex, food)}
      >
        <div className="flex-1">
          <div className="font-medium">{food.name}</div>
          <div className="text-sm text-muted-foreground">
            <Badge variant="secondary" className="mr-2">
              {food.category}
            </Badge>
            {food.calories} kcal/100g
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          P: {food.proteins}g | C: {food.carbs}g | G: {food.fats}g
        </div>
      </button>
    ))
  }, [addFoodToMeal])

  const handleSearchFoods = useCallback(async (term: string) => {
    if (term.trim()) {
      await searchFoods(term)
    } else {
      // Se não há termo, buscar por 'a' que retorna vários alimentos
      await searchFoods('a')
    }
  }, [searchFoods])

  // Busca em tempo real com debounce (a partir de 3 letras)
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 3) {
      return // Não buscar se menos de 3 caracteres
    }

    const timeoutId = setTimeout(() => {
      handleSearchFoods(searchTerm)
    }, 500) 

    return () => clearTimeout(timeoutId)
  }, [searchTerm, handleSearchFoods])

  // Carregar alimentos quando o dialog abre
  useEffect(() => {
    if (foodDialogOpen && selectedMealIndex !== null) {
      // Se não há termo de busca e não há alimentos, carregar alguns
      if (!searchTerm && foods.length === 0) {
        handleSearchFoods('')
      }
    }
  }, [foodDialogOpen, selectedMealIndex, searchTerm, foods.length, handleSearchFoods])

  // Helper function to validate form data
  const validateFormData = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios')
      return false
    }
    return true
  }

  // Helper function to process new meals
  const processNewMeal = async (meal: MealFormData, MealPlanService: typeof import('@/services/meal-plan.service').MealPlanService) => {
    const mealData = {
      mealPlanId: resolvedParams.id,
      name: meal.name,
      type: meal.type,
      suggestedTime: meal.time,
      foods: meal.foods.map(f => ({
        foodId: f.food.id,
        quantity: f.quantity,
        unit: f.unit
      }))
    }
    
    try {
      await MealPlanService.addMeal(mealData)
    } catch (error) {
      console.error('Erro ao adicionar nova refeição:', error)
      toast.error('Erro ao salvar', `Erro ao salvar refeição "${meal.name}".`)
    }
  }

  // Helper function to check if meal has changes
  const hasMealChanges = (meal: MealFormData, originalMeal: MealFormData) => {
    return (
      meal.foods.length !== originalMeal.foods.length ||
      meal.foods.some(currentFood => {
        const originalFood = originalMeal.foods.find(of => of.food.id === currentFood.food.id)
        return !originalFood || originalFood.quantity !== currentFood.quantity
      }) ||
      meal.name !== originalMeal.name ||
      meal.type !== originalMeal.type ||
      meal.time !== originalMeal.time
    )
  }

  // Helper function to process existing meals
  const processExistingMeal = async (meal: MealFormData, MealPlanService: typeof import('@/services/meal-plan.service').MealPlanService) => {
    const originalMeal = originalMeals.find(om => om.id === meal.id)
    if (!originalMeal) return

    if (hasMealChanges(meal, originalMeal)) {
      const updateMealData = {
        name: meal.name,
        type: meal.type,
        suggestedTime: meal.time,
        foods: meal.foods.map(f => ({
          foodId: f.food.id,
          quantity: f.quantity,
          unit: f.unit
        }))
      }
      
      try {
        if (meal.id) {
          await MealPlanService.updateMeal(meal.id, updateMealData)
        }
      } catch (error) {
        console.error('Erro ao atualizar refeição:', error)
        toast.error('Erro ao salvar', `Erro ao atualizar refeição "${meal.name}".`)
      }
    }
  }

  // Helper function to process all meals
  const processMeals = async () => {
    const { MealPlanService } = await import('@/services/meal-plan.service')
    
    for (const meal of formData.meals) {
      if (!meal.id && meal.name && meal.foods.length > 0) {
        await processNewMeal(meal, MealPlanService)
      } else if (meal.id) {
        await processExistingMeal(meal, MealPlanService)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateFormData()) return

    try {
      const mealPlanData: UpdateMealPlanData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate
      }

      const result = await updatePlan(resolvedParams.id, mealPlanData)
      
      if (result) {
        await processMeals()
        toast.success('Plano atualizado!', 'Todas as alterações foram salvas com sucesso')
        router.push('/dashboard/nutritionist/meal-plans')
      } else {
        toast.error('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios')
      }
    } catch (error) {
      console.error('Erro ao atualizar plano:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      if (errorMessage.includes('Data de início não pode ser no passado')) {
        toast.error('Data inválida', 'A data de início deve ser hoje ou no futuro')
      } else if (errorMessage.includes('não encontrado')) {
        toast.error('Plano não encontrado', 'O plano que você está tentando editar não existe mais')
      } else {
        toast.error('Erro ao atualizar', errorMessage)
      }
    }
  }

  // Mostra loading enquanto carrega os dados
  if (loadingPlan || !isInitialized) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/nutritionist/meal-plans">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Editar Plano Alimentar</h1>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-muted-foreground">Carregando plano alimentar...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mostra erro se não encontrou o plano
  if (!currentPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/nutritionist/meal-plans">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Editar Plano Alimentar</h1>
          </div>
          
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Plano alimentar não encontrado
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  O plano que você está tentando editar não existe ou foi removido.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const totalNutrition = calculateTotalNutrition()

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/nutritionist/meal-plans">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Editar Plano Alimentar</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Plano de Emagrecimento - Semana 1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrição opcional do plano alimentar"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">Data de Término *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Nutricional */}
          {formData.meals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo Nutricional Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(totalNutrition.calories)}
                    </div>
                    <div className="text-sm text-muted-foreground">Calorias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {Math.round(totalNutrition.proteins)}g
                    </div>
                    <div className="text-sm text-muted-foreground">Proteínas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Math.round(totalNutrition.carbs)}g
                    </div>
                    <div className="text-sm text-muted-foreground">Carboidratos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(totalNutrition.fats)}g
                    </div>
                    <div className="text-sm text-muted-foreground">Gorduras</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(totalNutrition.fiber)}g
                    </div>
                    <div className="text-sm text-muted-foreground">Fibras</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Refeições */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Refeições</CardTitle>
              <Button type="button" onClick={addMeal} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Refeição
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.meals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma refeição adicionada ainda.</p>
                  <p className="text-sm">Clique em &quot;Adicionar Refeição&quot; para começar.</p>
                </div>
              ) : (
                formData.meals.map((meal, mealIndex) => {
                  const mealNutrition = calculateMealNutrition(meal)
                  
                  return (
                    <Card key={`meal-${mealIndex}-${meal.id || meal.name || 'unnamed'}`} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div>
                                <Label>Nome da Refeição</Label>
                                <Input
                                  value={meal.name}
                                  onChange={(e) => updateMeal(mealIndex, 'name', e.target.value)}
                                  placeholder="Ex: Café da manhã"
                                />
                              </div>
                              <div>
                                <Label>Tipo</Label>
                                <select
                                  className="w-full px-3 py-2 border rounded-md"
                                  value={meal.type}
                                  onChange={(e) => updateMeal(mealIndex, 'type', e.target.value)}
                                >
                                  {MEAL_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label>Horário (opcional)</Label>
                                <Input
                                  type="time"
                                  value={meal.time || ''}
                                  onChange={(e) => updateMeal(mealIndex, 'time', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMeal(mealIndex)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Resumo nutricional da refeição */}
                        {meal.foods.length > 0 && (
                          <div className="grid grid-cols-5 gap-2 text-sm">
                            <div className="text-center">
                              <div className="font-semibold text-blue-600">{Math.round(mealNutrition.calories)}</div>
                              <div className="text-xs text-muted-foreground">kcal</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-red-600">{Math.round(mealNutrition.proteins)}g</div>
                              <div className="text-xs text-muted-foreground">prot</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-yellow-600">{Math.round(mealNutrition.carbs)}g</div>
                              <div className="text-xs text-muted-foreground">carb</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-purple-600">{Math.round(mealNutrition.fats)}g</div>
                              <div className="text-xs text-muted-foreground">gord</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-green-600">{Math.round(mealNutrition.fiber)}g</div>
                              <div className="text-xs text-muted-foreground">fibr</div>
                            </div>
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Alimentos</Label>
                            <Dialog 
                              open={foodDialogOpen && selectedMealIndex === mealIndex}
                              onOpenChange={(open) => {
                                setFoodDialogOpen(open)
                                if (open) {
                                  setSelectedMealIndex(mealIndex)
                                } else {
                                  setSelectedMealIndex(null)
                                  setSearchTerm('')
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button 
                                  type="button" 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedMealIndex(mealIndex)
                                    // Limpar busca anterior e carregar alguns alimentos
                                    setSearchTerm('')
                                    handleSearchFoods('')
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Adicionar Alimento
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Adicionar Alimento</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Buscar alimentos... (mín. 3 letras)"
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault()
                                          if (searchTerm.trim().length >= 3) {
                                            handleSearchFoods(searchTerm)
                                          }
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => handleSearchFoods(searchTerm)}
                                      disabled={foodsLoading || searchTerm.trim().length < 3}
                                    >
                                      <Search className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="max-h-96 overflow-y-auto space-y-2">
                                    {renderFoodsList(foods, mealIndex, searchTerm, foodsLoading)}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          {meal.foods.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                              Nenhum alimento adicionado a esta refeição
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {meal.foods.map((mealFood, foodIndex) => (
                                <div 
                                  key={`${mealFood.food.id}-${foodIndex}`}
                                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium">{mealFood.food.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {mealFood.food.category}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      value={mealFood.quantity}
                                      onChange={(e) => updateFoodQuantity(mealIndex, foodIndex, Number(e.target.value))}
                                      className="w-20 text-center"
                                      min="1"
                                    />
                                    <span className="text-sm text-muted-foreground w-8">{mealFood.unit}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground text-right min-w-[80px]">
                                    <div>{Math.round((mealFood.food.calories * mealFood.quantity) / 100)} kcal</div>
                                    <div>P: {Math.round((mealFood.food.proteins * mealFood.quantity) / 100)}g</div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFoodFromMeal(mealIndex, foodIndex)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <Link href="/dashboard/nutritionist/meal-plans">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}