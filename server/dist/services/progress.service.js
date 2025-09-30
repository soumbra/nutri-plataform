"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProgressService {
    // Criar novo registro de progresso
    static async create(data) {
        try {
            const progressRecord = await prisma.progressRecord.create({
                data: {
                    userId: data.userId,
                    weight: data.weight,
                    bodyFat: data.bodyFat,
                    muscle: data.muscle,
                    notes: data.notes,
                    photos: data.photos || [],
                    recordDate: data.recordDate || new Date()
                }
            });
            return progressRecord;
        }
        catch (error) {
            console.error('Erro ao criar registro de progresso:', error);
            throw new Error('Falha ao criar registro de progresso');
        }
    }
    // Buscar registros de progresso com filtros
    static async getAll(filters) {
        try {
            const where = {
                userId: filters.userId
            };
            if (filters.startDate || filters.endDate) {
                where.recordDate = {};
                if (filters.startDate) {
                    where.recordDate.gte = filters.startDate;
                }
                if (filters.endDate) {
                    where.recordDate.lte = filters.endDate;
                }
            }
            const progressRecords = await prisma.progressRecord.findMany({
                where,
                orderBy: {
                    recordDate: 'desc'
                },
                skip: filters.offset || 0,
                take: filters.limit || 50
            });
            return progressRecords;
        }
        catch (error) {
            console.error('Erro ao buscar registros de progresso:', error);
            throw new Error('Falha ao buscar registros de progresso');
        }
    }
    // Buscar registro específico por ID
    static async getById(id, userId) {
        try {
            const progressRecord = await prisma.progressRecord.findFirst({
                where: {
                    id,
                    userId // Garantir que o usuário só acesse seus próprios registros
                }
            });
            if (!progressRecord) {
                throw new Error('Registro de progresso não encontrado');
            }
            return progressRecord;
        }
        catch (error) {
            console.error('Erro ao buscar registro de progresso:', error);
            throw new Error('Falha ao buscar registro de progresso');
        }
    }
    // Atualizar registro de progresso
    static async update(id, userId, data) {
        try {
            // Verificar se o registro existe e pertence ao usuário
            await this.getById(id, userId);
            const updatedRecord = await prisma.progressRecord.update({
                where: { id },
                data: {
                    weight: data.weight,
                    bodyFat: data.bodyFat,
                    muscle: data.muscle,
                    notes: data.notes,
                    photos: data.photos,
                    recordDate: data.recordDate
                }
            });
            return updatedRecord;
        }
        catch (error) {
            console.error('Erro ao atualizar registro de progresso:', error);
            throw new Error('Falha ao atualizar registro de progresso');
        }
    }
    // Deletar registro de progresso
    static async delete(id, userId) {
        try {
            // Verificar se o registro existe e pertence ao usuário
            await this.getById(id, userId);
            await prisma.progressRecord.delete({
                where: { id }
            });
        }
        catch (error) {
            console.error('Erro ao deletar registro de progresso:', error);
            throw new Error('Falha ao deletar registro de progresso');
        }
    }
    // Obter estatísticas de progresso
    static async getStats(userId) {
        try {
            const records = await prisma.progressRecord.findMany({
                where: { userId },
                orderBy: { recordDate: 'asc' }
            });
            const stats = {
                totalRecords: records.length,
                trends: {
                    weightTrend: 'stable',
                    periodDays: 0
                }
            };
            if (records.length === 0) {
                return stats;
            }
            // Último registro
            stats.lastRecord = records[records.length - 1];
            // Registros com peso válido
            const weightRecords = records.filter(r => r.weight !== null && r.weight !== undefined);
            if (weightRecords.length > 0) {
                // Peso médio
                const totalWeight = weightRecords.reduce((sum, record) => sum + (record.weight || 0), 0);
                stats.averageWeight = totalWeight / weightRecords.length;
                // Mudança de peso (primeiro vs último)
                if (weightRecords.length >= 2) {
                    const firstRecord = weightRecords[0];
                    const lastRecord = weightRecords[weightRecords.length - 1];
                    stats.weightChange = {
                        initial: firstRecord.weight || 0,
                        current: lastRecord.weight || 0,
                        difference: (lastRecord.weight || 0) - (firstRecord.weight || 0),
                        percentage: firstRecord.weight ?
                            (((lastRecord.weight || 0) - (firstRecord.weight || 0)) / (firstRecord.weight || 1)) * 100
                            : 0
                    };
                    // Tendência de peso
                    const difference = stats.weightChange.difference;
                    if (Math.abs(difference) > 0.5) { // Diferença significativa > 0.5kg
                        stats.trends.weightTrend = difference > 0 ? 'increasing' : 'decreasing';
                    }
                    // Período em dias
                    const firstDate = new Date(firstRecord.recordDate);
                    const lastDate = new Date(lastRecord.recordDate);
                    stats.trends.periodDays = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
                }
            }
            return stats;
        }
        catch (error) {
            console.error('Erro ao obter estatísticas de progresso:', error);
            throw new Error('Falha ao obter estatísticas de progresso');
        }
    }
    // Buscar registros para gráfico (últimos N registros)
    static async getChartData(userId, limit = 30) {
        try {
            const records = await prisma.progressRecord.findMany({
                where: { userId },
                orderBy: { recordDate: 'desc' },
                take: limit
            });
            // Retornar em ordem cronológica para o gráfico
            return records.reverse();
        }
        catch (error) {
            console.error('Erro ao buscar dados para gráfico:', error);
            throw new Error('Falha ao buscar dados para gráfico');
        }
    }
}
exports.ProgressService = ProgressService;
//# sourceMappingURL=progress.service.js.map