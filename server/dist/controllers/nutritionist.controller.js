"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionistController = void 0;
const nutritionist_service_1 = require("../services/nutritionist.service");
class NutritionistController {
    static async getAll(req, res) {
        try {
            const filters = {
                specialty: req.query.specialty,
                minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
                experience: req.query.experience ? Number(req.query.experience) : undefined,
                search: req.query.search
            };
            const nutritionists = await nutritionist_service_1.NutritionistService.getAll(filters);
            res.json({
                success: true,
                data: nutritionists
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno'
            });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const nutritionist = await nutritionist_service_1.NutritionistService.getById(id);
            res.json({
                success: true,
                data: nutritionist
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error instanceof Error ? error.message : 'Nutricionista não encontrado'
            });
        }
    }
    static async getProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuário não autenticado'
                });
            }
            const nutritionist = await nutritionist_service_1.NutritionistService.getByUserId(req.user.userId);
            if (!nutritionist) {
                return res.status(404).json({
                    success: false,
                    error: 'Perfil de nutricionista não encontrado'
                });
            }
            res.json({
                success: true,
                data: nutritionist
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno'
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuário não autenticado'
                });
            }
            if (req.user.role !== 'NUTRITIONIST') {
                return res.status(403).json({
                    success: false,
                    error: 'Apenas nutricionistas podem atualizar este perfil'
                });
            }
            const nutritionist = await nutritionist_service_1.NutritionistService.updateProfile(req.user.userId, req.body);
            res.json({
                success: true,
                data: nutritionist
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno'
            });
        }
    }
    static async getSpecialties(req, res) {
        try {
            const specialties = await nutritionist_service_1.NutritionistService.getSpecialties();
            res.json({
                success: true,
                data: specialties
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno'
            });
        }
    }
}
exports.NutritionistController = NutritionistController;
//# sourceMappingURL=nutritionist.controller.js.map