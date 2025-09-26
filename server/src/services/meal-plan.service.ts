import { PrismaClient, MealType, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateMealPlanData {
  contractId: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
}

export interface CreateMealData {
  mealPlanId: string
  type: MealType
  name: string
  description?: string
  suggestedTime?: string
  foods: {
    foodId: string
    quantity: number // gramas
  }[]
}

export interface UpdateMealData {
  name?: string
  type?: MealType
  description?: string
  suggestedTime?: string
  foods?: {
    foodId: string
    quantity: number // gramas
  }[]
}

export interface MealPlanFilters {
  isActive?: boolean
  contractId?: string
  startDate?: Date
  endDate?: Date
  clientId?: string
}

export interface PaginationOptions {
  skip?: number
  take?: number
}

export interface NutritionalLimits {
  minCalories?: number
  maxCalories?: number
  minProtein?: number
  maxProtein?: number
}

export interface CopyPlanOptions {
  sourcePlanId: string
  targetContractId: string
  title: string
  startDate: Date
  endDate: Date
}

export class MealPlanService {
  // Método privado para buscar perfil do nutricionista
  private static async getNutritionistProfile(userId: string) {
    const profile = await prisma.nutritionistProfile.findUnique({
      where: { userId }
    })
    
    if (!profile) {
      throw new Error('Perfil de nutricionista não encontrado')
    }
    
    return profile
  }

  // Validar datas do plano
  private static validatePlanDates(startDate: Date, endDate: Date) {
    if (endDate <= startDate) {
      throw new Error('Data de fim deve ser posterior à data de início')
    }

    const now = new Date()
    now.setHours(0, 0, 0, 0) // Reset time to start of day
    const startDateOnly = new Date(startDate)
    startDateOnly.setHours(0, 0, 0, 0) // Reset time to start of day
    
    if (startDateOnly < now) {
      throw new Error('Data de início não pode ser no passado')
    }

    const maxDuration = 365 * 24 * 60 * 60 * 1000 // 1 ano em ms
    if (endDate.getTime() - startDate.getTime() > maxDuration) {
      throw new Error('Duração do plano não pode exceder 1 ano')
    }
  }

  // Validar limites nutricionais
  private static validateNutritionalLimits(calories: number, proteins: number, limits?: NutritionalLimits) {
    if (!limits) return

    if (limits.minCalories && calories < limits.minCalories) {
      throw new Error(`Calorias muito baixas. Mínimo: ${limits.minCalories}`)
    }

    if (limits.maxCalories && calories > limits.maxCalories) {
      throw new Error(`Calorias muito altas. Máximo: ${limits.maxCalories}`)
    }

    if (limits.minProtein && proteins < limits.minProtein) {
      throw new Error(`Proteínas insuficientes. Mínimo: ${limits.minProtein}g`)
    }

    if (limits.maxProtein && proteins > limits.maxProtein) {
      throw new Error(`Proteínas excessivas. Máximo: ${limits.maxProtein}g`)
    }
  }

  // Criar meal plan
  static async create(data: CreateMealPlanData, userId: string, role: string, limits?: NutritionalLimits) {
    if (role !== 'NUTRITIONIST') {
      throw new Error('Apenas nutricionistas podem criar planos alimentares')
    }

    // Validar datas
    this.validatePlanDates(data.startDate, data.endDate)

    const nutritionistProfile = await this.getNutritionistProfile(userId)

    // Verificar se o contrato existe e pertence ao nutricionista
    const contract = await prisma.contract.findFirst({
      where: {
        id: data.contractId,
        nutritionistId: nutritionistProfile.id,
        status: 'ACTIVE'
      },
      include: {
        client: {
          include: {
            clientProfile: true
          }
        }
      }
    })

    if (!contract) {
      throw new Error('Contrato não encontrado ou não está ativo')
    }

    return await prisma.mealPlan.create({
      data: {
        ...data,
        nutritionistId: nutritionistProfile.id
      },
      include: {
        meals: {
          include: {
            foods: {
              include: {
                food: true
              }
            }
          }
        },
        contract: {
          include: {
            client: {
              include: {
                clientProfile: true
              }
            },
            nutritionist: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })
  }

  // Listar meal plans (filtrado por role) com paginação
  static async getAll(
    userId: string, 
    role: string, 
    filters: MealPlanFilters = {}, 
    pagination: PaginationOptions = {}
  ) {
    const whereClause: Prisma.MealPlanWhereInput = {}

    if (role === 'NUTRITIONIST') {
      const nutritionistProfile = await this.getNutritionistProfile(userId)
      whereClause.nutritionistId = nutritionistProfile.id
    } else if (role === 'CLIENT') {
      whereClause.contract = {
        clientId: userId
      }
    }

    // Aplicar filtros adicionais
    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive
    }

    if (filters.contractId) {
      whereClause.contractId = filters.contractId
    }

    if (filters.clientId && role === 'NUTRITIONIST') {
      whereClause.contract = {
        clientId: filters.clientId
      }
    }

    if (filters.startDate || filters.endDate) {
      whereClause.startDate = {}
      if (filters.startDate) {
        whereClause.startDate.gte = filters.startDate
      }
      if (filters.endDate) {
        whereClause.startDate.lte = filters.endDate
      }
    }

    const [mealPlans, total] = await Promise.all([
      prisma.mealPlan.findMany({
        where: whereClause,
        skip: pagination.skip || 0,
        take: pagination.take || 20,
        include: {
          meals: {
            include: {
              foods: {
                include: {
                  food: true
                }
              }
            }
          },
          contract: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  clientProfile: true
                }
              },
              nutritionist: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.mealPlan.count({ where: whereClause })
    ])

    // Calcular informações nutricionais para cada plano
    const mealPlansWithNutrition = mealPlans.map(plan => {
      let totalCalories = 0
      let totalProteins = 0
      let totalCarbs = 0
      let totalFats = 0

      plan.meals.forEach(meal => {
        if (meal.calories) totalCalories += meal.calories
        if (meal.proteins) totalProteins += meal.proteins
        if (meal.carbs) totalCarbs += meal.carbs
        if (meal.fats) totalFats += meal.fats
      })

      return {
        ...plan,
        totalCalories: Math.round(totalCalories * 100) / 100,
        totalProteins: Math.round(totalProteins * 100) / 100,
        totalCarbs: Math.round(totalCarbs * 100) / 100,
        totalFats: Math.round(totalFats * 100) / 100
      }
    })

    return {
      data: mealPlansWithNutrition,
      pagination: {
        total,
        pages: Math.ceil(total / (pagination.take || 20)),
        current: Math.floor((pagination.skip || 0) / (pagination.take || 20)) + 1
      }
    }
  }

  // Buscar meal plan por ID
  static async getById(id: string, userId: string, role: string) {
    const whereClause: Prisma.MealPlanWhereInput = { id }

    if (role === 'NUTRITIONIST') {
      const nutritionistProfile = await this.getNutritionistProfile(userId)
      whereClause.nutritionistId = nutritionistProfile.id
    } else if (role === 'CLIENT') {
      whereClause.contract = {
        clientId: userId
      }
    }

    const mealPlan = await prisma.mealPlan.findFirst({
      where: whereClause,
      include: {
        meals: {
          include: {
            foods: {
              include: {
                food: true
              }
            }
          },
          orderBy: [
            { type: 'asc' },
            { suggestedTime: 'asc' }
          ]
        },
        contract: {
          include: {
            client: {
              include: {
                clientProfile: true
              }
            },
            nutritionist: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    if (!mealPlan) {
      throw new Error('Plano alimentar não encontrado')
    }

    return mealPlan
  }

  // Atualizar meal plan
  static async update(
    id: string, 
    data: Partial<CreateMealPlanData>, 
    userId: string, 
    role: string
  ) {
    if (role !== 'NUTRITIONIST') {
      throw new Error('Apenas nutricionistas podem editar planos alimentares')
    }

    // Validar datas se fornecidas
    if (data.startDate && data.endDate) {
      this.validatePlanDates(data.startDate, data.endDate)
    }

    const nutritionistProfile = await this.getNutritionistProfile(userId)

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id,
        nutritionistId: nutritionistProfile.id
      }
    })

    if (!mealPlan) {
      throw new Error('Plano alimentar não encontrado')
    }

    return await prisma.mealPlan.update({
      where: { id },
      data,
      include: {
        meals: {
          include: {
            foods: {
              include: {
                food: true
              }
            }
          }
        },
        contract: {
          include: {
            client: true,
            nutritionist: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })
  }

  // Deletar meal plan
  static async delete(id: string, userId: string, role: string) {
    if (role !== 'NUTRITIONIST') {
      throw new Error('Apenas nutricionistas podem excluir planos alimentares')
    }

    const nutritionistProfile = await this.getNutritionistProfile(userId)

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id,
        nutritionistId: nutritionistProfile.id
      }
    })

    if (!mealPlan) {
      throw new Error('Plano alimentar não encontrado')
    }

    return await prisma.$transaction(async (tx) => {
      // Deletar MealFoods primeiro
      await tx.mealFood.deleteMany({
        where: {
          meal: {
            mealPlanId: id
          }
        }
      })

      // Deletar Meals
      await tx.meal.deleteMany({
        where: {
          mealPlanId: id
        }
      })

      // Deletar MealPlan
      return await tx.mealPlan.delete({
        where: { id }
      })
    })
  }

  // Adicionar refeição ao plano
  static async addMeal(data: CreateMealData, userId: string, role: string, limits?: NutritionalLimits) {
    if (role !== 'NUTRITIONIST') {
      throw new Error('Apenas nutricionistas podem adicionar refeições')
    }

    const nutritionistProfile = await this.getNutritionistProfile(userId)

    // Verificar se o meal plan pertence ao nutricionista
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: data.mealPlanId,
        nutritionistId: nutritionistProfile.id
      }
    })

    if (!mealPlan) {
      throw new Error('Plano alimentar não encontrado')
    }

    return await prisma.$transaction(async (tx) => {
      // Criar a refeição
      const meal = await tx.meal.create({
        data: {
          mealPlanId: data.mealPlanId,
          type: data.type,
          name: data.name,
          description: data.description,
          suggestedTime: data.suggestedTime
        }
      })

      // Adicionar alimentos à refeição
      if (data.foods.length > 0) {
        await tx.mealFood.createMany({
          data: data.foods.map(food => ({
            mealId: meal.id,
            foodId: food.foodId,
            quantity: food.quantity
          }))
        })

        // Calcular informações nutricionais
        const nutritionalInfo = await this.calculateMealNutrition(meal.id, tx)
        
        // Validar limites se fornecidos
        if (limits && nutritionalInfo) {
          this.validateNutritionalLimits(
            nutritionalInfo.calories,
            nutritionalInfo.proteins,
            limits
          )
        }
      }

      return await tx.meal.findUnique({
        where: { id: meal.id },
        include: {
          foods: {
            include: {
              food: true
            }
          }
        }
      })
    })
  }

  // Atualizar refeição existente
  static async updateMeal(mealId: string, data: UpdateMealData, userId: string, role: string, limits?: NutritionalLimits) {
    if (role !== 'NUTRITIONIST') {
      throw new Error('Apenas nutricionistas podem atualizar refeições')
    }

    const nutritionistProfile = await this.getNutritionistProfile(userId)

    // Verificar se a refeição existe e pertence ao nutricionista
    const existingMeal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        mealPlan: {
          nutritionistId: nutritionistProfile.id
        }
      },
      include: {
        mealPlan: true,
        foods: true
      }
    })

    if (!existingMeal) {
      throw new Error('Refeição não encontrada')
    }

    return await prisma.$transaction(async (tx) => {
      // Atualizar dados básicos da refeição
      const updateData: Prisma.MealUpdateInput = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.type !== undefined) updateData.type = data.type
      if (data.description !== undefined) updateData.description = data.description
      if (data.suggestedTime !== undefined) updateData.suggestedTime = data.suggestedTime

      await tx.meal.update({
        where: { id: mealId },
        data: updateData
      })

      // Se alimentos foram fornecidos, atualizar completamente
      if (data.foods !== undefined) {
        // Remover todos os alimentos existentes
        await tx.mealFood.deleteMany({
          where: { mealId }
        })

        // Adicionar novos alimentos
        if (data.foods.length > 0) {
          await tx.mealFood.createMany({
            data: data.foods.map(food => ({
              mealId,
              foodId: food.foodId,
              quantity: food.quantity
            }))
          })

          // Calcular informações nutricionais
          const nutritionalInfo = await this.calculateMealNutrition(mealId, tx)
          
          // Validar limites se fornecidos
          if (limits && nutritionalInfo) {
            this.validateNutritionalLimits(
              nutritionalInfo.calories,
              nutritionalInfo.proteins,
              limits
            )
          }
        }
      }

      return await tx.meal.findUnique({
        where: { id: mealId },
        include: {
          foods: {
            include: {
              food: true
            }
          }
        }
      })
    })
  }

  // Copiar plano alimentar
  static async copyPlan(options: CopyPlanOptions, userId: string, role: string) {
    if (role !== 'NUTRITIONIST') {
      throw new Error('Apenas nutricionistas podem copiar planos alimentares')
    }

    this.validatePlanDates(options.startDate, options.endDate)

    const nutritionistProfile = await this.getNutritionistProfile(userId)

    // Verificar se o plano de origem existe e pertence ao nutricionista
    const sourcePlan = await prisma.mealPlan.findFirst({
      where: {
        id: options.sourcePlanId,
        nutritionistId: nutritionistProfile.id
      },
      include: {
        meals: {
          include: {
            foods: true
          }
        }
      }
    })

    if (!sourcePlan) {
      throw new Error('Plano de origem não encontrado')
    }

    // Verificar se o contrato de destino existe
    const targetContract = await prisma.contract.findFirst({
      where: {
        id: options.targetContractId,
        nutritionistId: nutritionistProfile.id,
        status: 'ACTIVE'
      }
    })

    if (!targetContract) {
      throw new Error('Contrato de destino não encontrado ou não está ativo')
    }

    return await prisma.$transaction(async (tx) => {
      // Criar o novo plano
      const newPlan = await tx.mealPlan.create({
        data: {
          contractId: options.targetContractId,
          nutritionistId: nutritionistProfile.id,
          title: options.title,
          description: `Copiado de: ${sourcePlan.title}`,
          startDate: options.startDate,
          endDate: options.endDate
        }
      })

      // Copiar todas as refeições
      for (const meal of sourcePlan.meals) {
        const newMeal = await tx.meal.create({
          data: {
            mealPlanId: newPlan.id,
            type: meal.type,
            name: meal.name,
            description: meal.description,
            suggestedTime: meal.suggestedTime,
            calories: meal.calories,
            proteins: meal.proteins,
            carbs: meal.carbs,
            fats: meal.fats
          }
        })

        // Copiar alimentos da refeição
        if (meal.foods.length > 0) {
          await tx.mealFood.createMany({
            data: meal.foods.map(food => ({
              mealId: newMeal.id,
              foodId: food.foodId,
              quantity: food.quantity
            }))
          })
        }
      }

      return await tx.mealPlan.findUnique({
        where: { id: newPlan.id },
        include: {
          meals: {
            include: {
              foods: {
                include: {
                  food: true
                }
              }
            }
          }
        }
      })
    })
  }

  // Método para recalcular nutrição de todo o plano
  static async recalculatePlanNutrition(mealPlanId: string, userId: string, role: string) {
    if (role !== 'NUTRITIONIST') {
      throw new Error('Apenas nutricionistas podem recalcular planos')
    }

    const nutritionistProfile = await this.getNutritionistProfile(userId)

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: mealPlanId,
        nutritionistId: nutritionistProfile.id
      },
      include: {
        meals: true
      }
    })

    if (!mealPlan) {
      throw new Error('Plano alimentar não encontrado')
    }

    return await prisma.$transaction(async (tx) => {
      for (const meal of mealPlan.meals) {
        await this.calculateMealNutrition(meal.id, tx)
      }
      
      return { success: true, recalculatedMeals: mealPlan.meals.length }
    })
  }

  // Calcular informações nutricionais de uma refeição
  private static async calculateMealNutrition(
    mealId: string, 
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || prisma

    const meal = await client.meal.findUnique({
      where: { id: mealId },
      include: {
        foods: {
          include: {
            food: true
          }
        }
      }
    })

    if (!meal) return null

    let totalCalories = 0
    let totalProteins = 0
    let totalCarbs = 0
    let totalFats = 0

    meal.foods.forEach(mealFood => {
      const quantity = mealFood.quantity / 100 // converter para porcentagem de 100g
      totalCalories += mealFood.food.calories * quantity
      totalProteins += mealFood.food.proteins * quantity
      totalCarbs += mealFood.food.carbs * quantity
      totalFats += mealFood.food.fats * quantity
    })

    const nutritionalInfo = {
      calories: Math.round(totalCalories * 100) / 100,
      proteins: Math.round(totalProteins * 100) / 100,
      carbs: Math.round(totalCarbs * 100) / 100,
      fats: Math.round(totalFats * 100) / 100
    }

    await client.meal.update({
      where: { id: mealId },
      data: nutritionalInfo
    })

    return nutritionalInfo
  }

  // Obter estatísticas do plano
  static async getPlanStatistics(mealPlanId: string, userId: string, role: string) {
    const mealPlan = await this.getById(mealPlanId, userId, role)
    
    let totalCalories = 0
    let totalProteins = 0
    let totalCarbs = 0
    let totalFats = 0
    
    const mealTypes = {
      BREAKFAST: 0,
      MORNING_SNACK: 0,
      LUNCH: 0,
      AFTERNOON_SNACK: 0,
      DINNER: 0,
      EVENING_SNACK: 0
    }

    mealPlan.meals.forEach(meal => {
      if (meal.calories) totalCalories += meal.calories
      if (meal.proteins) totalProteins += meal.proteins
      if (meal.carbs) totalCarbs += meal.carbs
      if (meal.fats) totalFats += meal.fats
      
      mealTypes[meal.type]++
    })

    return {
      totalMeals: mealPlan.meals.length,
      dailyNutrition: {
        calories: Math.round(totalCalories * 100) / 100,
        proteins: Math.round(totalProteins * 100) / 100,
        carbs: Math.round(totalCarbs * 100) / 100,
        fats: Math.round(totalFats * 100) / 100
      },
      mealDistribution: mealTypes,
      planDuration: Math.ceil(
        (mealPlan.endDate.getTime() - mealPlan.startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    }
  }
}