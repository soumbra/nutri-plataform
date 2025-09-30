"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const food_controller_1 = require("../controllers/food.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Rotas públicas (não requerem autenticação)
// GET /api/foods - Listar alimentos com filtros e paginação
router.get('/', food_controller_1.FoodController.getAll);
// GET /api/foods/categories - Buscar categorias disponíveis
router.get('/categories', food_controller_1.FoodController.getCategories);
// GET /api/foods/popular - Buscar alimentos populares (mais usados)
router.get('/popular', food_controller_1.FoodController.getPopular);
// GET /api/foods/search/nutrition - Buscar por perfil nutricional
router.get('/search/nutrition', food_controller_1.FoodController.searchByNutrition);
// GET /api/foods/:id - Buscar alimento por ID
router.get('/:id', food_controller_1.FoodController.getById);
// Rotas protegidas (requerem autenticação)
// POST /api/foods - Criar alimento personalizado (apenas nutricionistas)
router.post('/', auth_1.authenticateToken, food_controller_1.FoodController.create);
// PUT /api/foods/:id - Atualizar alimento (apenas nutricionistas)
router.put('/:id', auth_1.authenticateToken, food_controller_1.FoodController.update);
// DELETE /api/foods/:id - Deletar alimento (apenas nutricionistas)
router.delete('/:id', auth_1.authenticateToken, food_controller_1.FoodController.delete);
exports.default = router;
//# sourceMappingURL=foods.js.map