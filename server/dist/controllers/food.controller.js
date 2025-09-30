"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodController = void 0;
const food_service_1 = require("../services/food.service");
// Constantes para mensagens de erro
const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Usuário não autenticado',
    FOOD_NOT_FOUND: 'Alimento não encontrado',
    INTERNAL_ERROR: 'Erro interno'
};
class FoodController {
    // Método auxiliar para validação de autenticação
    static validateAuth(req) {
        if (!req.user) {
            return { isValid: false };
        }
        return { isValid: true, user: req.user };
    }
    // Método auxiliar para parsing de filtros de food
    static parseFoodFilters(query) {
        return {
            search: query.search,
            category: query.category,
            minCalories: query.minCalories ? parseFloat(query.minCalories) : undefined,
            maxCalories: query.maxCalories ? parseFloat(query.maxCalories) : undefined,
            minProteins: query.minProteins ? parseFloat(query.minProteins) : undefined,
            maxProteins: query.maxProteins ? parseFloat(query.maxProteins) : undefined,
            minCarbs: query.minCarbs ? parseFloat(query.minCarbs) : undefined,
            maxCarbs: query.maxCarbs ? parseFloat(query.maxCarbs) : undefined,
            minFats: query.minFats ? parseFloat(query.minFats) : undefined,
            maxFats: query.maxFats ? parseFloat(query.maxFats) : undefined,
            hasCategory: query.hasCategory ? query.hasCategory === 'true' : undefined
        };
    }
    // Método auxiliar para parsing de paginação
    static parsePagination(query) {
        return {
            skip: query.skip ? parseInt(query.skip) : undefined,
            take: query.take ? parseInt(query.take) : undefined
        };
    }
    // Método auxiliar para parsing de busca nutricional
    static parseNutritionalSearch(query) {
        return {
            targetCalories: query.targetCalories ? parseFloat(query.targetCalories) : undefined,
            targetProteins: query.targetProteins ? parseFloat(query.targetProteins) : undefined,
            tolerance: query.tolerance ? parseFloat(query.tolerance) : undefined
        };
    }
    // Método auxiliar para tratamento de erros
    static handleError(res, error) {
        if (error instanceof Error) {
            // Erro específico de recurso não encontrado
            if (error.message === ERROR_MESSAGES.FOOD_NOT_FOUND) {
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
            // Erro de conflito (alimento sendo usado)
            if (error.message.includes('sendo usado em planos')) {
                return res.status(409).json({
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
    // Listar alimentos com filtros e paginação
    static async getAll(req, res) {
        try {
            const filters = FoodController.parseFoodFilters(req.query);
            const pagination = FoodController.parsePagination(req.query);
            const result = await food_service_1.FoodService.getAll(filters, pagination);
            return FoodController.sendCustomSuccessResponse(res, result);
        }
        catch (error) {
            return FoodController.handleError(res, error);
        }
    }
    // Buscar alimento por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await food_service_1.FoodService.getById(id);
            return FoodController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return FoodController.handleError(res, error);
        }
    }
    // Criar alimento personalizado (apenas nutricionistas)
    static async create(req, res) {
        try {
            const { isValid, user } = FoodController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const data = req.body;
            const result = await food_service_1.FoodService.create(data, user.userId, user.role);
            return FoodController.sendSuccessResponse(res, result, 201);
        }
        catch (error) {
            return FoodController.handleError(res, error);
        }
    }
    // Atualizar alimento (apenas nutricionistas)
    static async update(req, res) {
        try {
            const { isValid, user } = FoodController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const { id } = req.params;
            const data = req.body;
            const result = await food_service_1.FoodService.update(id, data, user.userId, user.role);
            return FoodController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return FoodController.handleError(res, error);
        }
    }
    // Deletar alimento (apenas nutricionistas)
    static async delete(req, res) {
        try {
            const { isValid, user } = FoodController.validateAuth(req);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const { id } = req.params;
            await food_service_1.FoodService.delete(id, user.userId, user.role);
            return res.json({
                success: true,
                message: 'Alimento deletado com sucesso'
            });
        }
        catch (error) {
            return FoodController.handleError(res, error);
        }
    }
    // Buscar categorias disponíveis
    static async getCategories(req, res) {
        try {
            const result = await food_service_1.FoodService.getCategories();
            return FoodController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return FoodController.handleError(res, error);
        }
    }
    // Buscar alimentos populares (mais usados)
    static async getPopular(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const result = await food_service_1.FoodService.getPopular(limit);
            return FoodController.sendSuccessResponse(res, result);
        }
        catch (error) {
            return FoodController.handleError(res, error);
        }
    }
    // Buscar por perfil nutricional
    static async searchByNutrition(req, res) {
        try {
            const search = FoodController.parseNutritionalSearch(req.query);
            const pagination = FoodController.parsePagination(req.query);
            const result = await food_service_1.FoodService.searchByNutrition(search, pagination);
            return FoodController.sendCustomSuccessResponse(res, result);
        }
        catch (error) {
            return FoodController.handleError(res, error);
        }
    }
}
exports.FoodController = FoodController;
//# sourceMappingURL=food.controller.js.map