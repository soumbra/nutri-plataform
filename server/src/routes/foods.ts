import { Router } from 'express'
import { FoodController } from '../controllers/food.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Rotas públicas (não requerem autenticação)

// GET /api/foods - Listar alimentos com filtros e paginação
router.get('/', FoodController.getAll)

// GET /api/foods/categories - Buscar categorias disponíveis
router.get('/categories', FoodController.getCategories)

// GET /api/foods/popular - Buscar alimentos populares (mais usados)
router.get('/popular', FoodController.getPopular)

// GET /api/foods/search/nutrition - Buscar por perfil nutricional
router.get('/search/nutrition', FoodController.searchByNutrition)

// GET /api/foods/:id - Buscar alimento por ID
router.get('/:id', FoodController.getById)

// Rotas protegidas (requerem autenticação)

// POST /api/foods - Criar alimento personalizado (apenas nutricionistas)
router.post('/', authenticateToken, FoodController.create)

// PUT /api/foods/:id - Atualizar alimento (apenas nutricionistas)
router.put('/:id', authenticateToken, FoodController.update)

// DELETE /api/foods/:id - Deletar alimento (apenas nutricionistas)
router.delete('/:id', authenticateToken, FoodController.delete)

export default router