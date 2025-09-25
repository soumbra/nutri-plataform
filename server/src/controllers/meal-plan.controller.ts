import { Response } from 'express'
import { MealPlanService, CreateMealPlanData, CreateMealData, MealPlanFilters, PaginationOptions, NutritionalLimits, CopyPlanOptions } from '../services/meal-plan.service'
import { AuthRequest } from '../types'

// Constantes para mensagens de erro
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Usuário não autenticado',
  MEAL_PLAN_NOT_FOUND: 'Plano alimentar não encontrado',
  INTERNAL_ERROR: 'Erro interno'
} as const

export class MealPlanController {
  // Método auxiliar para validação de autenticação
  private static validateAuth(req: AuthRequest): { isValid: boolean; user?: AuthRequest['user'] } {
    if (!req.user) {
      return { isValid: false }
    }
    return { isValid: true, user: req.user }
  }

  // Método auxiliar para conversão de datas
  private static convertDates(data: any): any {
    const converted = { ...data }
    
    if (converted.startDate && typeof converted.startDate === 'string') {
      converted.startDate = new Date(converted.startDate)
    }
    if (converted.endDate && typeof converted.endDate === 'string') {
      converted.endDate = new Date(converted.endDate)
    }
    
    return converted
  }

  // Método auxiliar para parsing de filtros de meal plan
  private static parseMealPlanFilters(query: any): MealPlanFilters {
    return {
      isActive: query.isActive ? query.isActive === 'true' : undefined,
      contractId: query.contractId as string,
      clientId: query.clientId as string,
      startDate: query.startDate ? new Date(query.startDate as string) : undefined,
      endDate: query.endDate ? new Date(query.endDate as string) : undefined
    }
  }

  // Método auxiliar para parsing de paginação
  private static parsePagination(query: any): PaginationOptions {
    return {
      skip: query.skip ? parseInt(query.skip as string) : undefined,
      take: query.take ? parseInt(query.take as string) : undefined
    }
  }

  // Método auxiliar para tratamento de erros
  private static handleError(res: Response, error: unknown) {
    if (error instanceof Error) {
      // Erro específico de recurso não encontrado
      if (error.message === ERROR_MESSAGES.MEAL_PLAN_NOT_FOUND) {
        return res.status(404).json({
          success: false,
          error: error.message
        })
      }

      // Erro de autorização
      if (error.message.includes('Apenas nutricionistas')) {
        return res.status(403).json({
          success: false,
          error: error.message
        })
      }

      // Erro de validação (dados inválidos)
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    // Erro interno não identificado
    return res.status(500).json({
      success: false,
      error: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }

  // Método auxiliar para resposta de sucesso
  private static sendSuccessResponse(res: Response, data: any, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      data
    })
  }

  // Método auxiliar para resposta de sucesso com estrutura customizada
  private static sendCustomSuccessResponse(res: Response, payload: any, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      ...payload
    })
  }
  // Criar novo plano alimentar
  static async create(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const data: CreateMealPlanData = MealPlanController.convertDates(req.body)
      const limits: NutritionalLimits | undefined = req.body.limits

      const result = await MealPlanService.create(data, user!.userId, user!.role, limits)
      
      return MealPlanController.sendSuccessResponse(res, result, 201)
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }

  // Listar planos alimentares com filtros e paginação
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const filters = MealPlanController.parseMealPlanFilters(req.query)
      const pagination = MealPlanController.parsePagination(req.query)

      const result = await MealPlanService.getAll(user!.userId, user!.role, filters, pagination)
      
      return MealPlanController.sendCustomSuccessResponse(res, result)
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }

  // Buscar plano alimentar por ID
  static async getById(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const { id } = req.params
      const result = await MealPlanService.getById(id, user!.userId, user!.role)
      
      return MealPlanController.sendSuccessResponse(res, result)
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }

  // Atualizar plano alimentar
  static async update(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const { id } = req.params
      const data = MealPlanController.convertDates(req.body)

      const result = await MealPlanService.update(id, data, user!.userId, user!.role)
      
      return MealPlanController.sendSuccessResponse(res, result)
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }

  // Deletar plano alimentar
  static async delete(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const { id } = req.params
      await MealPlanService.delete(id, user!.userId, user!.role)
      
      return res.json({
        success: true,
        message: 'Plano alimentar deletado com sucesso'
      })
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }

  // Adicionar refeição ao plano
  static async addMeal(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const data: CreateMealData = req.body
      const limits: NutritionalLimits | undefined = req.body.limits

      const result = await MealPlanService.addMeal(data, user!.userId, user!.role, limits)
      
      return MealPlanController.sendSuccessResponse(res, result, 201)
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }

  // Copiar plano alimentar
  static async copyPlan(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const options: CopyPlanOptions = MealPlanController.convertDates(req.body)

      const result = await MealPlanService.copyPlan(options, user!.userId, user!.role)
      
      return MealPlanController.sendSuccessResponse(res, result, 201)
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }

  // Recalcular nutrição do plano
  static async recalculateNutrition(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const { id } = req.params
      const result = await MealPlanService.recalculatePlanNutrition(id, user!.userId, user!.role)
      
      return MealPlanController.sendSuccessResponse(res, result)
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }

  // Obter estatísticas do plano
  static async getStatistics(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = MealPlanController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const { id } = req.params
      const result = await MealPlanService.getPlanStatistics(id, user!.userId, user!.role)
      
      return MealPlanController.sendSuccessResponse(res, result)
    } catch (error) {
      return MealPlanController.handleError(res, error)
    }
  }
}