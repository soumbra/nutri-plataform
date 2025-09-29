export type ContractStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED'

export interface Contract {
  id: string
  clientId: string
  nutritionistId: string
  status: ContractStatus
  startDate: string
  endDate?: string
  monthlyPrice: number
  createdAt: string
  updatedAt: string
  client: {
    id: string
    name: string
    email: string
    phone?: string
  }
  nutritionist: {
    id: string
    crn: string
    specialty?: string
    experience?: number
    bio?: string
    pricePerHour?: number
    isActive: boolean
    user: {
      id: string
      name: string
      email: string
      phone?: string
    }
  }
  mealPlans?: MealPlan[]
}

export interface CreateContractData {
  nutritionistId: string
  monthlyPrice: number
  endDate?: string
}

export interface ContractFilters {
  status?: ContractStatus
  clientId?: string
  nutritionistId?: string
  [key: string]: unknown
}

export interface UpdateContractStatusData {
  status: ContractStatus
}

// Para evitar dependência circular, definindo interface simplificada
interface MealPlan {
  id: string
  title: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}