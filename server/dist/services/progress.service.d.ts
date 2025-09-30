import { ProgressRecord } from '@prisma/client';
export interface CreateProgressData {
    userId: string;
    weight?: number;
    bodyFat?: number;
    muscle?: number;
    notes?: string;
    photos?: string[];
    recordDate?: Date;
}
export interface UpdateProgressData {
    weight?: number;
    bodyFat?: number;
    muscle?: number;
    notes?: string;
    photos?: string[];
    recordDate?: Date;
}
export interface ProgressFilters {
    userId: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}
export interface ProgressStats {
    totalRecords: number;
    weightChange?: {
        initial: number;
        current: number;
        difference: number;
        percentage: number;
    };
    averageWeight?: number;
    lastRecord?: ProgressRecord;
    trends: {
        weightTrend: 'increasing' | 'decreasing' | 'stable';
        periodDays: number;
    };
}
export declare class ProgressService {
    static create(data: CreateProgressData): Promise<ProgressRecord>;
    static getAll(filters: ProgressFilters): Promise<ProgressRecord[]>;
    static getById(id: string, userId: string): Promise<ProgressRecord>;
    static update(id: string, userId: string, data: UpdateProgressData): Promise<ProgressRecord>;
    static delete(id: string, userId: string): Promise<void>;
    static getStats(userId: string): Promise<ProgressStats>;
    static getChartData(userId: string, limit?: number): Promise<ProgressRecord[]>;
}
//# sourceMappingURL=progress.service.d.ts.map