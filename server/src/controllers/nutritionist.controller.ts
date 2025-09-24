import { Request, Response } from 'express'
import { NutritionistService } from '../services/nutritionist.service'
import { AuthRequest } from '../types'

export class NutritionistController {
  static async getAll(req: Request, res: Response) {
    try {
      const filters = {
        specialty: req.query.specialty as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        experience: req.query.experience ? Number(req.query.experience) : undefined,
        search: req.query.search as string
      }

      const nutritionists = await NutritionistService.getAll(filters)

      res.json({
        success: true,
        data: nutritionists
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const nutritionist = await NutritionistService.getById(id)

      res.json({
        success: true,
        data: nutritionist
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Nutricionista não encontrado'
      })
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const nutritionist = await NutritionistService.getByUserId(req.user.userId)

      if (!nutritionist) {
        return res.status(404).json({
          success: false,
          error: 'Perfil de nutricionista não encontrado'
        })
      }

      res.json({
        success: true,
        data: nutritionist
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      })
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      if (req.user.role !== 'NUTRITIONIST') {
        return res.status(403).json({
          success: false,
          error: 'Apenas nutricionistas podem atualizar este perfil'
        })
      }

      const nutritionist = await NutritionistService.updateProfile(
        req.user.userId,
        req.body
      )

      res.json({
        success: true,
        data: nutritionist
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      })
    }
  }

  static async getSpecialties(req: Request, res: Response) {
    try {
      const specialties = await NutritionistService.getSpecialties()

      res.json({
        success: true,
        data: specialties
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      })
    }
  }
}