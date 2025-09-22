import { Request } from 'express'

export interface AuthRequest extends Request {
  user?: {
    userId: string  
    email: string
    role: 'CLIENT' | 'NUTRITIONIST' | 'ADMIN'
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
  role: 'CLIENT' | 'NUTRITIONIST'
  phone?: string
}