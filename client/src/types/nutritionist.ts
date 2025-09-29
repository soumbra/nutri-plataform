export interface Nutritionist {
  id: string
  userId: string
  crn: string
  specialty: string | null
  experience: number | null
  bio: string | null
  pricePerHour: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    avatar: string | null
    createdAt: string
  }
  _count: {
    contracts: number
  }
}

export interface NutritionistFilters {
  specialty?: string
  minPrice?: number
  maxPrice?: number
  experience?: number
  search?: string
  [key: string]: unknown
}