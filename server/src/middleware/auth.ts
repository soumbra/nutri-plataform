import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { verifyToken } from '../utils/jwt'

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' })
  }

  try {
    const decoded = verifyToken(token)
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }
    next()
  } catch (error) {
    console.error('Token verification failed:', error)
    return res.status(403).json({ error: 'Token inválido' })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permissão insuficiente' })
    }

    next()
  }
}