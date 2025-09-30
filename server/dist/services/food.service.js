"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FoodService {
    // Validar dados nutricionais
    static validateNutritionalData(data) {
        const nutritionalFields = ['calories', 'proteins', 'carbs', 'fats', 'fiber'];
        for (const field of nutritionalFields) {
            const value = data[field];
            if (value !== undefined && (value < 0 || value > 10000)) {
                throw new Error(`${field} deve estar entre 0 e 10000`);
            }
        }
        // Validar se o nome não está vazio
        if (data.name !== undefined && (!data.name || data.name.trim().length === 0)) {
            throw new Error('Nome do alimento é obrigatório');
        }
        // Validar se o nome não é muito longo
        if (data.name !== undefined && data.name.length > 200) {
            throw new Error('Nome do alimento não pode exceder 200 caracteres');
        }
    }
    // Listar alimentos com filtros e paginação
    static async getAll(filters = {}, pagination = {}) {
        const whereClause = {};
        // Filtros básicos
        if (filters.search) {
            whereClause.name = {
                contains: filters.search,
                mode: 'insensitive'
            };
        }
        if (filters.category) {
            whereClause.category = filters.category;
        }
        if (filters.hasCategory !== undefined) {
            whereClause.category = filters.hasCategory ? { not: null } : null;
        }
        // Filtros nutricionais - aplicação direta
        if (filters.minCalories !== undefined || filters.maxCalories !== undefined) {
            whereClause.calories = {};
            if (filters.minCalories !== undefined)
                whereClause.calories.gte = filters.minCalories;
            if (filters.maxCalories !== undefined)
                whereClause.calories.lte = filters.maxCalories;
        }
        if (filters.minProteins !== undefined || filters.maxProteins !== undefined) {
            whereClause.proteins = {};
            if (filters.minProteins !== undefined)
                whereClause.proteins.gte = filters.minProteins;
            if (filters.maxProteins !== undefined)
                whereClause.proteins.lte = filters.maxProteins;
        }
        const [foods, total] = await Promise.all([
            prisma.food.findMany({
                where: whereClause,
                skip: pagination.skip || 0,
                take: pagination.take || 50,
                orderBy: {
                    name: 'asc'
                }
            }),
            prisma.food.count({ where: whereClause })
        ]);
        return {
            data: foods,
            pagination: {
                total,
                pages: Math.ceil(total / (pagination.take || 50)),
                current: Math.floor((pagination.skip || 0) / (pagination.take || 50)) + 1
            }
        };
    }
    // Buscar alimento por ID
    static async getById(id) {
        const food = await prisma.food.findUnique({
            where: { id }
        });
        if (!food) {
            throw new Error('Alimento não encontrado');
        }
        return food;
    }
    // Criar alimento personalizado (apenas nutricionistas)
    static async create(data, userId, role) {
        if (role !== 'NUTRITIONIST') {
            throw new Error('Apenas nutricionistas podem criar alimentos personalizados');
        }
        this.validateNutritionalData(data);
        return await prisma.food.create({
            data
        });
    }
    // Atualizar alimento (apenas nutricionistas)
    static async update(id, data, userId, role) {
        if (role !== 'NUTRITIONIST') {
            throw new Error('Apenas nutricionistas podem atualizar alimentos');
        }
        this.validateNutritionalData(data);
        const food = await prisma.food.findUnique({
            where: { id }
        });
        if (!food) {
            throw new Error('Alimento não encontrado');
        }
        return await prisma.food.update({
            where: { id },
            data
        });
    }
    // Deletar alimento (apenas nutricionistas)
    static async delete(id, userId, role) {
        if (role !== 'NUTRITIONIST') {
            throw new Error('Apenas nutricionistas podem deletar alimentos');
        }
        const food = await prisma.food.findUnique({
            where: { id }
        });
        if (!food) {
            throw new Error('Alimento não encontrado');
        }
        // Verificar se o alimento está sendo usado em algum plano
        const usageCount = await prisma.mealFood.count({
            where: { foodId: id }
        });
        if (usageCount > 0) {
            throw new Error('Não é possível deletar um alimento que está sendo usado em planos alimentares');
        }
        return await prisma.food.delete({
            where: { id }
        });
    }
    // Buscar por perfil nutricional
    static async searchByNutrition(search, pagination = {}) {
        if (!search.targetCalories && !search.targetProteins) {
            throw new Error('Pelo menos um valor nutricional alvo deve ser fornecido');
        }
        const tolerance = search.tolerance || 10; // 10% de tolerância por padrão
        const whereClause = {};
        if (search.targetCalories) {
            const minCal = search.targetCalories * (1 - tolerance / 100);
            const maxCal = search.targetCalories * (1 + tolerance / 100);
            whereClause.calories = {
                gte: minCal,
                lte: maxCal
            };
        }
        if (search.targetProteins) {
            const minProt = search.targetProteins * (1 - tolerance / 100);
            const maxProt = search.targetProteins * (1 + tolerance / 100);
            whereClause.proteins = {
                gte: minProt,
                lte: maxProt
            };
        }
        const [foods, total] = await Promise.all([
            prisma.food.findMany({
                where: whereClause,
                skip: pagination.skip || 0,
                take: pagination.take || 20,
                orderBy: [
                    { calories: 'asc' },
                    { name: 'asc' }
                ]
            }),
            prisma.food.count({ where: whereClause })
        ]);
        return {
            data: foods,
            pagination: {
                total,
                pages: Math.ceil(total / (pagination.take || 20)),
                current: Math.floor((pagination.skip || 0) / (pagination.take || 20)) + 1
            }
        };
    }
    // Buscar categorias disponíveis
    static async getCategories() {
        const categories = await prisma.food.findMany({
            select: {
                category: true
            },
            distinct: ['category'],
            where: {
                category: {
                    not: null
                }
            },
            orderBy: {
                category: 'asc'
            }
        });
        return categories
            .map(item => item.category)
            .filter(Boolean);
    }
    // Buscar alimentos populares (mais usados)
    static async getPopular(limit = 20) {
        // Buscar alimentos mais usados em meal plans
        const popularFoods = await prisma.mealFood.groupBy({
            by: ['foodId'],
            _count: {
                foodId: true
            },
            orderBy: {
                _count: {
                    foodId: 'desc'
                }
            },
            take: limit
        });
        const foodIds = popularFoods.map(item => item.foodId);
        if (foodIds.length === 0) {
            return await prisma.food.findMany({
                take: limit,
                orderBy: {
                    name: 'asc'
                }
            });
        }
        return await prisma.food.findMany({
            where: {
                id: {
                    in: foodIds
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
    }
}
exports.FoodService = FoodService;
//# sourceMappingURL=food.service.js.map