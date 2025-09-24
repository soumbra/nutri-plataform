import { Router } from 'express'
import { NutritionistController } from '../controllers/nutritionist.controller'
import { authenticateToken, requireRole } from '../middleware/auth'
import { validate, updateNutritionistSchema } from '../middleware/validation'

const router = Router()

router.get('/', NutritionistController.getAll)
router.get('/specialties', NutritionistController.getSpecialties)
router.get('/:id', NutritionistController.getById)

router.get('/profile/me', authenticateToken, requireRole(['NUTRITIONIST']), NutritionistController.getProfile)
router.put('/profile/me', authenticateToken, requireRole(['NUTRITIONIST']), validate(updateNutritionistSchema), NutritionistController.updateProfile)

export default router