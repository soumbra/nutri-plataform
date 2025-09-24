import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface NutritionistFilters {
  specialty?: string
  minPrice?: number
  maxPrice?: number
  experience?: number
  location?: string
  search?: string
}

export class NutritionistService {
  static async getAll(filters: NutritionistFilters = {}) {
    const { specialty, minPrice, maxPrice, experience, search } = filters

    const nutritionists = await prisma.nutritionistProfile.findMany({
      where: {
        isActive: true,
        AND: [
          specialty ? { specialty: { contains: specialty, mode: 'insensitive' } } : {},
          minPrice ? { pricePerHour: { gte: minPrice } } : {},
          maxPrice ? { pricePerHour: { lte: maxPrice } } : {},
          experience ? { experience: { gte: experience } } : {},
          search ? {
            OR: [
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { specialty: { contains: search, mode: 'insensitive' } },
              { bio: { contains: search, mode: 'insensitive' } }
            ]
          } : {}
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            contracts: true
          }
        }
      },
      orderBy: [
        { experience: 'desc' },
        { pricePerHour: 'asc' }
      ]
    })

    return nutritionists
  }

  static async getById(id: string) {
    const nutritionist = await prisma.nutritionistProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true
          }
        },
        contracts: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            startDate: true,
            client: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            contracts: true
          }
        }
      }
    })

    if (!nutritionist || !nutritionist.isActive) {
      throw new Error('Nutricionista não encontrado')
    }

    return nutritionist
  }

  static async getByUserId(userId: string) {
    const nutritionist = await prisma.nutritionistProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        contracts: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                clientProfile: true
              }
            }
          },
          orderBy: { startDate: 'desc' }
        },
        _count: {
          select: {
            contracts: true
          }
        }
      }
    })

    return nutritionist
  }

  static async updateProfile(userId: string, data: {
    specialty?: string
    experience?: number
    bio?: string
    pricePerHour?: number
    isActive?: boolean
  }) {
    const nutritionist = await prisma.nutritionistProfile.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    })

    return nutritionist
  }

  static async getSpecialties() {
    const specialties = await prisma.nutritionistProfile.findMany({
      where: { isActive: true },
      select: { specialty: true },
      distinct: ['specialty']
    })

    return specialties
      .map(item => item.specialty)
      .filter((specialty): specialty is string => Boolean(specialty))
      .sort((a, b) => a.localeCompare(b))
  }
}