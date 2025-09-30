"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlanController = void 0;
const meal_plan_service_1 = require("../services/meal-plan.service");
// Constantes para mensagens de erro
const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Usuário não autenticado',
    MEAL_PLAN_NOT_FOUND: 'Plano alimentar não encontrado',
    INTERNAL_ERROR: 'Erro interno'
};
class MealPlanController {
    // Método auxiliar para validação de autenticação
    static validateAuth(req) {
        if (!req.user) {
            return { isValid: false };
        }
        return { isValid: true, user: req.user };
    }
    // Método auxiliar para conversão de datas
    static convertDates(data) {
        const converted = { ...data };
        if (converted.startDate && typeof converted.startDate === 'string') {
            // Parse como data local para evitar problemas de timezone
            const parts = converted.startDate.split('-');
            converted.startDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        if (converted.endDate && typeof converted.endDate === 'string') {
            // Parse como data local para evitar problemas de timezone
            const parts = converted.endDate.split('-');
            converted.endDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        return converted;
    }
    // Método auxiliar para parsing de filtros de meal plan
    static parseMealPlanFilters(query) {
        const parseLocalDate = (dateString) => {
            const parts = dateString.split('-');
            return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        };
        return {
            isActive: query.isActive ? query.isActive === 'true' : undefined,
            contractId: query.contractId,
            clientId: query.clientId,
            startDate: query.startDate ? parseLocalDate(query.startDate) : undefined,
            endDate: query.endDate ? parseLocalDate(query.endDate) : undefined
        };
    }
    // Método auxiliar para parsing de paginação
    static parsePagination(query) {
        return {
            skip: query.skip ? parseInt(query.skip) : undefined,
            take: query.take ? parseInt(query.take) : undefined
        };
    }
    // Método auxiliar para tratamento de erros
    static handleError(res, error) {
        if (error instanceof Error) {
            // Erro específico de recurso não encontrado
            if (error.message === ERROR_MESSAGES.MEAL_PLAN_NOT_FOUND) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            // Erro de autorização
            if (error.message.includes('Apenas nutricionistas')) {
                return res.status(403).json({
                    success: false,
                    error: error.message
                });
            }
            // Erro de validação (dados inválidos)
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        // Erro interno não identificado
        return res.status(500).json({
            success: false,
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
    // Método auxiliar para resposta de sucesso
    static sendSuccessResponse(res, data, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            data
        });
    }
    // Método auxiliar para resposta de sucesso com estrutura customizada
    static sendCustomSuccessResponse(res, payload, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            ...payload
        });
    }
    // Criar novo plano alimentar
    static async create(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const data = MealPlanController.convertDates(req.body);
            const limits = req.body.limits;
            const result = await meal_plan_service_1.MealPlanService.create(data, user.userId, user.role, limits);
            return MealPlanController.sendSuccessResponse(res, result, 201);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Listar planos alimentares com filtros e paginação
    static async getAll(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const filters = MealPlanController.parseMealPlanFilters(req.query);
            const pagination = MealPlanController.parsePagination(req.query);
            const result = await meal_plan_service_1.MealPlanService.getAll(user.userId, user.role, filters, pagination);
            return MealPlanController.sendCustomSuccessResponse(res, result);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Buscar plano alimentar por ID
    static async getById(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const { id } = req.params;
            const result = await meal_plan_service_1.MealPlanService.getById(id, user.userId, user.role);
            return MealPlanController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Atualizar plano alimentar
    static async update(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const { id } = req.params;
            const data = MealPlanController.convertDates(req.body);
            const result = await meal_plan_service_1.MealPlanService.update(id, data, user.userId, user.role);
            return MealPlanController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Deletar plano alimentar
    static async delete(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const { id } = req.params;
            await meal_plan_service_1.MealPlanService.delete(id, user.userId, user.role);
            return res.json({
                success: true,
                message: 'Plano alimentar deletado com sucesso'
            });
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Adicionar refeição ao plano
    static async addMeal(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const data = req.body;
            const limits = req.body.limits;
            const result = await meal_plan_service_1.MealPlanService.addMeal(data, user.userId, user.role, limits);
            return MealPlanController.sendSuccessResponse(res, result, 201);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Atualizar refeição existente
    static async updateMeal(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const { id } = req.params;
            const data = req.body;
            const limits = req.body.limits;
            const result = await meal_plan_service_1.MealPlanService.updateMeal(id, data, user.userId, user.role, limits);
            return MealPlanController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Copiar plano alimentar
    static async copyPlan(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const options = MealPlanController.convertDates(req.body);
            const result = await meal_plan_service_1.MealPlanService.copyPlan(options, user.userId, user.role);
            return MealPlanController.sendSuccessResponse(res, result, 201);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Recalcular nutrição do plano
    static async recalculateNutrition(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const { id } = req.params;
            const result = await meal_plan_service_1.MealPlanService.recalculatePlanNutrition(id, user.userId, user.role);
            return MealPlanController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
    // Obter estatísticas do plano
    static async getStatistics(req, res) {
        try {
            const { isValid, user } = MealPlanController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const { id } = req.params;
            const result = await meal_plan_service_1.MealPlanService.getPlanStatistics(id, user.userId, user.role);
            return MealPlanController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return MealPlanController.handleError(res, error);
        }
    }
}
exports.MealPlanController = MealPlanController;
//# sourceMappingURL=meal-plan.controller.js.map