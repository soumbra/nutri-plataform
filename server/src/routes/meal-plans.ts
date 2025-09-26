import { Router } from 'express'
import { MealPlanController } from '../controllers/meal-plan.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Todas as rotas de meal-plans requerem autenticação
router.use(authenticateToken)

// GET /api/meal-plans - Listar planos alimentares com filtros e paginação
router.get('/', MealPlanController.getAll)

// GET /api/meal-plans/:id - Buscar plano alimentar por ID
router.get('/:id', MealPlanController.getById)

// POST /api/meal-plans - Criar novo plano alimentar
router.post('/', MealPlanController.create)

// PUT /api/meal-plans/:id - Atualizar plano alimentar
router.put('/:id', MealPlanController.update)

// DELETE /api/meal-plans/:id - Deletar plano alimentar
router.delete('/:id', MealPlanController.delete)

// POST /api/meal-plans/meals - Adicionar refeição ao plano
router.post('/meals', MealPlanController.addMeal)

// PUT /api/meal-plans/meals/:id - Atualizar refeição existente
router.put('/meals/:id', MealPlanController.updateMeal)

// POST /api/meal-plans/copy - Copiar plano alimentar
router.post('/copy', MealPlanController.copyPlan)

// PUT /api/meal-plans/:id/recalculate - Recalcular nutrição do plano
router.put('/:id/recalculate', MealPlanController.recalculateNutrition)

// GET /api/meal-plans/:id/statistics - Obter estatísticas do plano
router.get('/:id/statistics', MealPlanController.getStatistics)

export default router