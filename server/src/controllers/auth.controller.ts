import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { AuthRequest } from '../types'

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await AuthService.login({ email, password })
      
      res.json({
        success: true,
        data: result
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      })
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const userData = req.body
      const result = await AuthService.register(userData)
      
      res.status(201).json({
        success: true,
        data: result
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      })
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const user = await AuthService.getUserById(req.user.userId)
      
      res.json({
        success: true,
        data: { user }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      })
    }
  }
}