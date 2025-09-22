import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
})

export const registerSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  role: z.enum(['CLIENT', 'NUTRITIONIST']),
  phone: z.string().optional()
})

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.issues
        })
      }
      next(error)
    }
  }
}