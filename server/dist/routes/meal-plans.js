"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meal_plan_controller_1 = require("../controllers/meal-plan.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas as rotas de meal-plans requerem autenticação
router.use(auth_1.authenticateToken);
// GET /api/meal-plans - Listar planos alimentares com filtros e paginação
router.get('/', meal_plan_controller_1.MealPlanController.getAll);
// GET /api/meal-plans/:id - Buscar plano alimentar por ID
router.get('/:id', meal_plan_controller_1.MealPlanController.getById);
// POST /api/meal-plans - Criar novo plano alimentar
router.post('/', meal_plan_controller_1.MealPlanController.create);
// PUT /api/meal-plans/:id - Atualizar plano alimentar
router.put('/:id', meal_plan_controller_1.MealPlanController.update);
// DELETE /api/meal-plans/:id - Deletar plano alimentar
router.delete('/:id', meal_plan_controller_1.MealPlanController.delete);
// POST /api/meal-plans/meals - Adicionar refeição ao plano
router.post('/meals', meal_plan_controller_1.MealPlanController.addMeal);
// PUT /api/meal-plans/meals/:id - Atualizar refeição existente
router.put('/meals/:id', meal_plan_controller_1.MealPlanController.updateMeal);
// POST /api/meal-plans/copy - Copiar plano alimentar
router.post('/copy', meal_plan_controller_1.MealPlanController.copyPlan);
// PUT /api/meal-plans/:id/recalculate - Recalcular nutrição do plano
router.put('/:id/recalculate', meal_plan_controller_1.MealPlanController.recalculateNutrition);
// GET /api/meal-plans/:id/statistics - Obter estatísticas do plano
router.get('/:id/statistics', meal_plan_controller_1.MealPlanController.getStatistics);
exports.default = router;
//# sourceMappingURL=meal-plans.js.map