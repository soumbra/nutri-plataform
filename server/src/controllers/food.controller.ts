import { Request, Response } from 'express'
import { FoodService, CreateFoodData, UpdateFoodData, FoodFilters, PaginationOptions, NutritionalSearch } from '../services/food.service'
import { AuthRequest } from '../types'

// Constantes para mensagens de erro
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Usuário não autenticado',
  FOOD_NOT_FOUND: 'Alimento não encontrado',
  INTERNAL_ERROR: 'Erro interno'
} as const

export class FoodController {
  // Método auxiliar para validação de autenticação
  private static validateAuth(req: AuthRequest): { isValid: boolean; user?: AuthRequest['user'] } {
    if (!req.user) {
      return { isValid: false }
    }
    return { isValid: true, user: req.user }
  }

  // Método auxiliar para parsing de filtros de food
  private static parseFoodFilters(query: any): FoodFilters {
    return {
      search: query.search as string,
      category: query.category as string,
      minCalories: query.minCalories ? parseFloat(query.minCalories as string) : undefined,
      maxCalories: query.maxCalories ? parseFloat(query.maxCalories as string) : undefined,
      minProteins: query.minProteins ? parseFloat(query.minProteins as string) : undefined,
      maxProteins: query.maxProteins ? parseFloat(query.maxProteins as string) : undefined,
      minCarbs: query.minCarbs ? parseFloat(query.minCarbs as string) : undefined,
      maxCarbs: query.maxCarbs ? parseFloat(query.maxCarbs as string) : undefined,
      minFats: query.minFats ? parseFloat(query.minFats as string) : undefined,
      maxFats: query.maxFats ? parseFloat(query.maxFats as string) : undefined,
      hasCategory: query.hasCategory ? query.hasCategory === 'true' : undefined
    }
  }

  // Método auxiliar para parsing de paginação
  private static parsePagination(query: any): PaginationOptions {
    return {
      skip: query.skip ? parseInt(query.skip as string) : undefined,
      take: query.take ? parseInt(query.take as string) : undefined
    }
  }

  // Método auxiliar para parsing de busca nutricional
  private static parseNutritionalSearch(query: any): NutritionalSearch {
    return {
      targetCalories: query.targetCalories ? parseFloat(query.targetCalories as string) : undefined,
      targetProteins: query.targetProteins ? parseFloat(query.targetProteins as string) : undefined,
      tolerance: query.tolerance ? parseFloat(query.tolerance as string) : undefined
    }
  }

  // Método auxiliar para tratamento de erros
  private static handleError(res: Response, error: unknown) {
    if (error instanceof Error) {
      // Erro específico de recurso não encontrado
      if (error.message === ERROR_MESSAGES.FOOD_NOT_FOUND) {
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

      // Erro de conflito (alimento sendo usado)
      if (error.message.includes('sendo usado em planos')) {
        return res.status(409).json({
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
  // Listar alimentos com filtros e paginação
  static async getAll(req: Request, res: Response) {
    try {
      const filters = FoodController.parseFoodFilters(req.query)
      const pagination = FoodController.parsePagination(req.query)

      const result = await FoodService.getAll(filters, pagination)
      
      return FoodController.sendCustomSuccessResponse(res, result)
    } catch (error) {
      return FoodController.handleError(res, error)
    }
  }

  // Buscar alimento por ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await FoodService.getById(id)
      
      return FoodController.sendSuccessResponse(res, result)
    } catch (error) {
      return FoodController.handleError(res, error)
    }
  }

  // Criar alimento personalizado (apenas nutricionistas)
  static async create(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = FoodController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const data: CreateFoodData = req.body
      const result = await FoodService.create(data, user!.userId, user!.role)
      
      return FoodController.sendSuccessResponse(res, result, 201)
    } catch (error) {
      return FoodController.handleError(res, error)
    }
  }

  // Atualizar alimento (apenas nutricionistas)
  static async update(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = FoodController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const { id } = req.params
      const data: UpdateFoodData = req.body
      const result = await FoodService.update(id, data, user!.userId, user!.role)
      
      return FoodController.sendSuccessResponse(res, result)
    } catch (error) {
      return FoodController.handleError(res, error)
    }
  }

  // Deletar alimento (apenas nutricionistas)
  static async delete(req: AuthRequest, res: Response) {
    try {
      const { isValid, user } = FoodController.validateAuth(req)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED
        })
      }

      const { id } = req.params
      await FoodService.delete(id, user!.userId, user!.role)
      
      return res.json({
        success: true,
        message: 'Alimento deletado com sucesso'
      })
    } catch (error) {
      return FoodController.handleError(res, error)
    }
  }

  // Buscar categorias disponíveis
  static async getCategories(req: Request, res: Response) {
    try {
      const result = await FoodService.getCategories()
      
      return FoodController.sendSuccessResponse(res, result)
    } catch (error) {
      return FoodController.handleError(res, error)
    }
  }

  // Buscar alimentos populares (mais usados)
  static async getPopular(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
      const result = await FoodService.getPopular(limit)
      
      return FoodController.sendSuccessResponse(res, result)
    } catch (error) {
      return FoodController.handleError(res, error)
    }
  }

  // Buscar por perfil nutricional
  static async searchByNutrition(req: Request, res: Response) {
    try {
      const search = FoodController.parseNutritionalSearch(req.query)
      const pagination = FoodController.parsePagination(req.query)

      const result = await FoodService.searchByNutrition(search, pagination)
      
      return FoodController.sendCustomSuccessResponse(res, result)
    } catch (error) {
      return FoodController.handleError(res, error)
    }
  }
}