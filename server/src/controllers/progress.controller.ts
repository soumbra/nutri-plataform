import { Response } from 'express'
import { ProgressService, CreateProgressData, UpdateProgressData } from '../services/progress.service'
import { ContractService } from '../services/contract.service'
import { AuthRequest } from '../types'
import { z } from 'zod'

// Schemas de validação
const createProgressSchema = z.object({
  weight: z.number().positive('Peso deve ser positivo').optional(),
  bodyFat: z.number().min(0).max(100, 'Percentual de gordura deve estar entre 0 e 100').optional(),
  muscle: z.number().positive('Massa muscular deve ser positiva').optional(),
  notes: z.string().max(1000, 'Notas não podem exceder 1000 caracteres').optional(),
  photos: z.array(z.string()).optional(),
  recordDate: z.coerce.date().optional()
})

const updateProgressSchema = createProgressSchema.partial()

const getProgressQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => !isNaN(val) && val > 0, 'Limit deve ser um número positivo').optional(),
  offset: z.string().transform(val => parseInt(val, 10)).refine(val => !isNaN(val) && val >= 0, 'Offset deve ser um número não negativo').optional()
})

export class ProgressController {
  // Criar novo registro de progresso
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const validatedData = createProgressSchema.parse(req.body)

      // Verificar se pelo menos um campo de medição foi fornecido
      if (!validatedData.weight && !validatedData.bodyFat && !validatedData.muscle) {
        return res.status(400).json({
          success: false,
          error: 'Pelo menos um campo de medição (peso, gordura corporal ou massa muscular) deve ser fornecido'
        })
      }

      const progressData: CreateProgressData = {
        userId: req.user.userId,
        weight: validatedData.weight,
        bodyFat: validatedData.bodyFat,
        muscle: validatedData.muscle,
        notes: validatedData.notes,
        photos: validatedData.photos,
        recordDate: validatedData.recordDate
      }

      const progressRecord = await ProgressService.create(progressData)

      res.status(201).json({
        success: true,
        data: progressRecord,
        message: 'Registro de progresso criado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao criar registro de progresso:', error)
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  // Buscar registros de progresso do usuário
  static async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const filters = getProgressQuerySchema.parse(req.query)

      const progressRecords = await ProgressService.getAll({
        userId: req.user.userId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: filters.limit,
        offset: filters.offset
      })

      res.json({
        success: true,
        data: progressRecords
      })
    } catch (error) {
      console.error('Erro ao buscar registros de progresso:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  // Buscar registro específico por ID
  static async getById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const { id } = req.params

      const progressRecord = await ProgressService.getById(id, req.user.userId)

      res.json({
        success: true,
        data: progressRecord
      })
    } catch (error) {
      console.error('Erro ao buscar registro de progresso:', error)
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Registro não encontrado'
      })
    }
  }

  // Atualizar registro de progresso
  static async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const { id } = req.params
      const validatedData = updateProgressSchema.parse(req.body)

      const updateData: UpdateProgressData = {
        weight: validatedData.weight,
        bodyFat: validatedData.bodyFat,
        muscle: validatedData.muscle,
        notes: validatedData.notes,
        photos: validatedData.photos,
        recordDate: validatedData.recordDate
      }

      const updatedRecord = await ProgressService.update(id, req.user.userId, updateData)

      res.json({
        success: true,
        data: updatedRecord,
        message: 'Registro de progresso atualizado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao atualizar registro de progresso:', error)
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  // Deletar registro de progresso
  static async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const { id } = req.params

      await ProgressService.delete(id, req.user.userId)

      res.json({
        success: true,
        data: null,
        message: 'Registro de progresso excluído com sucesso'
      })
    } catch (error) {
      console.error('Erro ao deletar registro de progresso:', error)
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  // Obter estatísticas de progresso
  static async getStats(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const stats = await ProgressService.getStats(req.user.userId)

      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      console.error('Erro ao obter estatísticas de progresso:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  // Obter dados para gráfico
  static async getChartData(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const { limit } = req.query
      const chartLimit = limit ? parseInt(limit as string, 10) : 30

      if (isNaN(chartLimit) || chartLimit <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Limit deve ser um número positivo'
        })
      }

      const chartData = await ProgressService.getChartData(req.user.userId, chartLimit)

      res.json({
        success: true,
        data: chartData
      })
    } catch (error) {
      console.error('Erro ao obter dados para gráfico:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  // ⚠️ Endpoint especial para nutricionistas verem progresso dos clientes
  static async getClientProgress(req: AuthRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'NUTRITIONIST') {
        return res.status(403).json({
          success: false,
          error: 'Apenas nutricionistas podem acessar este endpoint'
        })
      }

      const { clientId } = req.params
      const filters = getProgressQuerySchema.parse(req.query)

      // Verificar se o cliente está associado ao nutricionista via contrato ativo
      try {
        const contracts = await ContractService.getByUserRole(req.user.userId, 'NUTRITIONIST')
        const hasActiveContract = contracts.some(contract => 
          contract.clientId === clientId && 
          contract.status === 'ACTIVE'
        )

        if (!hasActiveContract) {
          return res.status(403).json({
            success: false,
            error: 'Você não possui contrato ativo com este cliente'
          })
        }
      } catch (contractError) {
        console.error('Erro ao verificar contrato:', contractError)
        return res.status(403).json({
          success: false,
          error: 'Erro ao verificar associação com cliente'
        })
      }

      const progressRecords = await ProgressService.getAll({
        userId: clientId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: filters.limit,
        offset: filters.offset
      })

      const stats = await ProgressService.getStats(clientId)

      res.json({
        success: true,
        data: {
          records: progressRecords,
          stats
        }
      })
    } catch (error) {
      console.error('Erro ao buscar progresso do cliente:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }
}