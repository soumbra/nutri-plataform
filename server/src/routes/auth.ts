import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate, loginSchema, registerSchema } from '../middleware/validation'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// POST /api/auth/login
router.post('/login', validate(loginSchema), AuthController.login)

// POST /api/auth/register
router.post('/register', validate(registerSchema), AuthController.register)

// GET /api/auth/me
router.get('/me', authenticateToken, AuthController.me)

export default router