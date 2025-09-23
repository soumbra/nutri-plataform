export interface User {
  id: string
  email: string
  name: string
  role: 'CLIENT' | 'NUTRITIONIST' | 'ADMIN'
  phone?: string
  avatar?: string
  clientProfile?: ClientProfile
  nutritionistProfile?: NutritionistProfile
}

export interface ClientProfile {
  id: string
  age?: number
  height?: number
  weight?: number
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  goal?: string
  restrictions?: string
}

export interface NutritionistProfile {
  id: string
  crn: string
  specialty?: string
  experience?: number
  bio?: string
  pricePerHour?: number
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  name: string
  password: string
  role: 'CLIENT' | 'NUTRITIONIST'
  phone?: string
}

export interface AuthResponse {
  success: boolean
  data: {
    token: string
    user: User
  }
}