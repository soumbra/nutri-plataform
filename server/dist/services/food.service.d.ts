export interface CreateFoodData {
    name: string;
    category?: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    fiber?: number;
}
export interface UpdateFoodData {
    name?: string;
    category?: string;
    calories?: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
}
export interface FoodFilters {
    search?: string;
    category?: string;
    minCalories?: number;
    maxCalories?: number;
    minProteins?: number;
    maxProteins?: number;
    minCarbs?: number;
    maxCarbs?: number;
    minFats?: number;
    maxFats?: number;
    hasCategory?: boolean;
}
export interface PaginationOptions {
    skip?: number;
    take?: number;
}
export interface NutritionalSearch {
    targetCalories?: number;
    targetProteins?: number;
    tolerance?: number;
}
export declare class FoodService {
    private static validateNutritionalData;
    static getAll(filters?: FoodFilters, pagination?: PaginationOptions): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            calories: number;
            proteins: number;
            carbs: number;
            fats: number;
            category: string | null;
            fiber: number | null;
        }[];
        pagination: {
            total: number;
            pages: number;
            current: number;
        };
    }>;
    static getById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        category: string | null;
        fiber: number | null;
    }>;
    static create(data: CreateFoodData, userId: string, role: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        category: string | null;
        fiber: number | null;
    }>;
    static update(id: string, data: UpdateFoodData, userId: string, role: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        category: string | null;
        fiber: number | null;
    }>;
    static delete(id: string, userId: string, role: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        category: string | null;
        fiber: number | null;
    }>;
    static searchByNutrition(search: NutritionalSearch, pagination?: PaginationOptions): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            calories: number;
            proteins: number;
            carbs: number;
            fats: number;
            category: string | null;
            fiber: number | null;
        }[];
        pagination: {
            total: number;
            pages: number;
            current: number;
        };
    }>;
    static getCategories(): Promise<(string | null)[]>;
    static getPopular(limit?: number): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        category: string | null;
        fiber: number | null;
    }[]>;
}
//# sourceMappingURL=food.service.d.ts.map