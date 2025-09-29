import { PrismaClient, ContractStatus } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateContractData {
  clientId: string
  nutritionistId: string
  monthlyPrice: number
  endDate?: Date
}

export interface ContractFilters {
  status?: ContractStatus
  clientId?: string
  nutritionistId?: string
}

export class ContractService {
  static async create(data: CreateContractData) {
    // Verificar se já existe contrato ativo entre cliente e nutricionista
    const existingContract = await prisma.contract.findFirst({
      where: {
        clientId: data.clientId,
        nutritionistId: data.nutritionistId,
        status: ContractStatus.ACTIVE
      }
    })

    if (existingContract) {
      throw new Error('Já existe um contrato ativo com este nutricionista')
    }

    // Verificar se o nutricionista existe e está ativo
    const nutritionist = await prisma.nutritionistProfile.findFirst({
      where: {
        id: data.nutritionistId,
        isActive: true
      },
      include: {
        user: true
      }
    })

    if (!nutritionist) {
      throw new Error('Nutricionista não encontrado ou inativo')
    }

    // Verificar se o cliente existe
    const client = await prisma.user.findFirst({
      where: {
        id: data.clientId,
        role: 'CLIENT'
      }
    })

    if (!client) {
      throw new Error('Cliente não encontrado')
    }

    // Criar o contrato
    const contract = await prisma.contract.create({
      data: {
        clientId: data.clientId,
        nutritionistId: data.nutritionistId,
        monthlyPrice: data.monthlyPrice,
        endDate: data.endDate,
        status: ContractStatus.ACTIVE
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        nutritionist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    })

    return contract
  }

  static async getAll(filters: ContractFilters = {}) {
    const where: any = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.clientId) {
      where.clientId = filters.clientId
    }

    if (filters.nutritionistId) {
      where.nutritionistId = filters.nutritionistId
    }

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        nutritionist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        mealPlans: {
          select: {
            id: true,
            title: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Limitar para não sobrecarregar
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return contracts
  }

  static async getById(id: string) {
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        nutritionist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        mealPlans: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!contract) {
      throw new Error('Contrato não encontrado')
    }

    return contract
  }

  static async updateStatus(id: string, status: ContractStatus) {
    const contract = await prisma.contract.findUnique({
      where: { id }
    })

    if (!contract) {
      throw new Error('Contrato não encontrado')
    }

    const updatedContract = await prisma.contract.update({
      where: { id },
      data: { 
        status,
        ...(status === ContractStatus.CANCELLED || status === ContractStatus.COMPLETED 
          ? { endDate: new Date() } 
          : {}
        )
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        nutritionist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    })

    return updatedContract
  }

  static async getByUserRole(userId: string, userRole: 'CLIENT' | 'NUTRITIONIST') {
    const where: any = {}

    if (userRole === 'CLIENT') {
      where.clientId = userId
    } else if (userRole === 'NUTRITIONIST') {
      // Buscar pelo nutritionistProfile
      const nutritionist = await prisma.nutritionistProfile.findFirst({
        where: { userId }
      })

      if (!nutritionist) {
        throw new Error('Perfil de nutricionista não encontrado')
      }

      where.nutritionistId = nutritionist.id
    }

    return this.getAll(where)
  }

  // ⚠️ APENAS PARA DESENVOLVIMENTO - Remover em produção
  static async delete(id: string): Promise<void> {
    const contract = await prisma.contract.findUnique({
      where: { id }
    })

    if (!contract) {
      throw new Error('Contrato não encontrado')
    }

    await prisma.contract.delete({
      where: { id }
    })
  }
}