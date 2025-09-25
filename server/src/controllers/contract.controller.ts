import { Response } from 'express'
import { ContractService, CreateContractData } from '../services/contract.service'
import { AuthRequest } from '../types'
import { z } from 'zod'
import { ContractStatus } from '@prisma/client'

// Schemas de validação
const createContractSchema = z.object({
  nutritionistId: z.string().min(1, 'ID do nutricionista é obrigatório'),
  monthlyPrice: z.number().positive('Preço deve ser positivo'),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
})

const updateContractStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED'] as const)
})

const getContractsQuerySchema = z.object({
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED'] as const).optional(),
  clientId: z.string().optional(),
  nutritionistId: z.string().optional()
})

export class ContractController {
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      // Apenas clientes podem criar contratos
      if (req.user.role !== 'CLIENT') {
        return res.status(403).json({
          success: false,
          error: 'Apenas clientes podem contratar nutricionistas'
        })
      }

      const validatedData = createContractSchema.parse(req.body)

      const contractData: CreateContractData = {
        clientId: req.user.userId,
        nutritionistId: validatedData.nutritionistId,
        monthlyPrice: validatedData.monthlyPrice,
        endDate: validatedData.endDate
      }

      const contract = await ContractService.create(contractData)

      res.status(201).json({
        success: true,
        data: contract,
        message: 'Contrato criado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      // Validar query parameters
      const filters = getContractsQuerySchema.parse(req.query)

      let contracts

      // Se não especificou filtros, buscar por role do usuário
      if (!filters.clientId && !filters.nutritionistId) {
        if (req.user.role === 'ADMIN') {
          contracts = await ContractService.getAll(filters)
        } else if (req.user.role === 'CLIENT' || req.user.role === 'NUTRITIONIST') {
          contracts = await ContractService.getByUserRole(req.user.userId, req.user.role)
        } else {
          return res.status(403).json({
            success: false,
            error: 'Tipo de usuário inválido'
          })
        }
      } else {
        // Verificar permissões para filtros específicos
        if (filters.clientId && req.user.role !== 'CLIENT' && filters.clientId !== req.user.userId) {
          return res.status(403).json({
            success: false,
            error: 'Sem permissão para visualizar contratos de outros clientes'
          })
        }

        contracts = await ContractService.getAll(filters)
      }

      res.json({
        success: true,
        data: contracts
      })
    } catch (error) {
      console.error('Erro ao buscar contratos:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const { id } = req.params
      const contract = await ContractService.getById(id)

      // Verificar se o usuário tem permissão para ver este contrato
      const hasPermission = 
        contract.clientId === req.user.userId || 
        (req.user.role === 'NUTRITIONIST' && contract.nutritionist.userId === req.user.userId)

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: 'Sem permissão para visualizar este contrato'
        })
      }

      res.json({
        success: true,
        data: contract
      })
    } catch (error) {
      console.error('Erro ao buscar contrato:', error)
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Contrato não encontrado'
      })
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const { id } = req.params
      const { status } = updateContractStatusSchema.parse(req.body)

      // Buscar o contrato para verificar permissões
      const existingContract = await ContractService.getById(id)

      // Verificar permissões
      const isClient = req.user.userId === existingContract.clientId
      const isNutritionist = req.user.role === 'NUTRITIONIST' && 
                           existingContract.nutritionist.userId === req.user.userId

      if (!isClient && !isNutritionist) {
        return res.status(403).json({
          success: false,
          error: 'Sem permissão para alterar este contrato'
        })
      }

      // Regras de negócio para mudança de status
      if (status === ContractStatus.CANCELLED) {
        // Ambos podem cancelar
      } else if (status === ContractStatus.PAUSED) {
        // Apenas nutricionista pode pausar
        if (!isNutritionist) {
          return res.status(403).json({
            success: false,
            error: 'Apenas nutricionistas podem pausar contratos'
          })
        }
      } else if (status === ContractStatus.COMPLETED) {
        // Apenas nutricionista pode completar
        if (!isNutritionist) {
          return res.status(403).json({
            success: false,
            error: 'Apenas nutricionistas podem finalizar contratos'
          })
        }
      }

      const updatedContract = await ContractService.updateStatus(id, status)

      res.json({
        success: true,
        data: updatedContract,
        message: 'Status do contrato atualizado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao atualizar status do contrato:', error)
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }

  // ⚠️ APENAS PARA DESENVOLVIMENTO - Remover em produção
  static async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const { id } = req.params
      
      // Verificar se o contrato existe e se o usuário tem permissão
      const contract = await ContractService.getById(id)
      
      if (contract.clientId !== req.user.userId && contract.nutritionistId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          error: 'Sem permissão para excluir este contrato'
        })
      }

      await ContractService.delete(id)

      res.json({
        success: true,
        data: null,
        message: 'Contrato excluído com sucesso'
      })
    } catch (error) {
      console.error('Erro ao excluir contrato:', error)
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      })
    }
  }
}