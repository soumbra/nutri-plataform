import { MealType } from '@prisma/client';
export interface CreateMealPlanData {
    contractId: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
}
export interface CreateMealData {
    mealPlanId: string;
    type: MealType;
    name: string;
    description?: string;
    suggestedTime?: string;
    foods: {
        foodId: string;
        quantity: number;
    }[];
}
export interface UpdateMealData {
    name?: string;
    type?: MealType;
    description?: string;
    suggestedTime?: string;
    foods?: {
        foodId: string;
        quantity: number;
    }[];
}
export interface MealPlanFilters {
    isActive?: boolean;
    contractId?: string;
    startDate?: Date;
    endDate?: Date;
    clientId?: string;
}
export interface PaginationOptions {
    skip?: number;
    take?: number;
}
export interface NutritionalLimits {
    minCalories?: number;
    maxCalories?: number;
    minProtein?: number;
    maxProtein?: number;
}
export interface CopyPlanOptions {
    sourcePlanId: string;
    targetContractId: string;
    title: string;
    startDate: Date;
    endDate: Date;
}
export declare class MealPlanService {
    private static getNutritionistProfile;
    private static validatePlanDates;
    private static validateNutritionalLimits;
    static create(data: CreateMealPlanData, userId: string, role: string, limits?: NutritionalLimits): Promise<{
        contract: {
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    weight: number | null;
                    age: number | null;
                    height: number | null;
                    gender: import(".prisma/client").$Enums.Gender | null;
                    activityLevel: import(".prisma/client").$Enums.ActivityLevel | null;
                    goal: string | null;
                    restrictions: string | null;
                    medicalInfo: string | null;
                } | null;
            } & {
                email: string;
                password: string;
                id: string;
                name: string;
                role: import(".prisma/client").$Enums.UserRole;
                avatar: string | null;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            nutritionist: {
                user: {
                    email: string;
                    password: string;
                    id: string;
                    name: string;
                    role: import(".prisma/client").$Enums.UserRole;
                    avatar: string | null;
                    phone: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                specialty: string | null;
                experience: number | null;
                bio: string | null;
                pricePerHour: number | null;
                isActive: boolean;
                userId: string;
                crn: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ContractStatus;
            clientId: string;
            nutritionistId: string;
            startDate: Date;
            endDate: Date | null;
            monthlyPrice: number;
        };
        meals: ({
            foods: ({
                food: {
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
                };
            } & {
                id: string;
                mealId: string;
                foodId: string;
                quantity: number;
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.MealType;
            description: string | null;
            mealPlanId: string;
            calories: number | null;
            proteins: number | null;
            carbs: number | null;
            fats: number | null;
            suggestedTime: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        description: string | null;
        nutritionistId: string;
        startDate: Date;
        endDate: Date;
        contractId: string;
    }>;
    static getAll(userId: string, role: string, filters?: MealPlanFilters, pagination?: PaginationOptions): Promise<{
        data: {
            totalCalories: number;
            totalProteins: number;
            totalCarbs: number;
            totalFats: number;
            contract: {
                client: {
                    email: string;
                    id: string;
                    name: string;
                    clientProfile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        weight: number | null;
                        age: number | null;
                        height: number | null;
                        gender: import(".prisma/client").$Enums.Gender | null;
                        activityLevel: import(".prisma/client").$Enums.ActivityLevel | null;
                        goal: string | null;
                        restrictions: string | null;
                        medicalInfo: string | null;
                    } | null;
                };
                nutritionist: {
                    user: {
                        email: string;
                        id: string;
                        name: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    specialty: string | null;
                    experience: number | null;
                    bio: string | null;
                    pricePerHour: number | null;
                    isActive: boolean;
                    userId: string;
                    crn: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ContractStatus;
                clientId: string;
                nutritionistId: string;
                startDate: Date;
                endDate: Date | null;
                monthlyPrice: number;
            };
            meals: ({
                foods: ({
                    food: {
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
                    };
                } & {
                    id: string;
                    mealId: string;
                    foodId: string;
                    quantity: number;
                })[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.MealType;
                description: string | null;
                mealPlanId: string;
                calories: number | null;
                proteins: number | null;
                carbs: number | null;
                fats: number | null;
                suggestedTime: string | null;
            })[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            title: string;
            description: string | null;
            nutritionistId: string;
            startDate: Date;
            endDate: Date;
            contractId: string;
        }[];
        pagination: {
            total: number;
            pages: number;
            current: number;
        };
    }>;
    static getById(id: string, userId: string, role: string): Promise<{
        totalCalories: number;
        totalProteins: number;
        totalCarbs: number;
        totalFats: number;
        contract: {
            client: {
                clientProfile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    weight: number | null;
                    age: number | null;
                    height: number | null;
                    gender: import(".prisma/client").$Enums.Gender | null;
                    activityLevel: import(".prisma/client").$Enums.ActivityLevel | null;
                    goal: string | null;
                    restrictions: string | null;
                    medicalInfo: string | null;
                } | null;
            } & {
                email: string;
                password: string;
                id: string;
                name: string;
                role: import(".prisma/client").$Enums.UserRole;
                avatar: string | null;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            nutritionist: {
                user: {
                    email: string;
                    password: string;
                    id: string;
                    name: string;
                    role: import(".prisma/client").$Enums.UserRole;
                    avatar: string | null;
                    phone: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                specialty: string | null;
                experience: number | null;
                bio: string | null;
                pricePerHour: number | null;
                isActive: boolean;
                userId: string;
                crn: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ContractStatus;
            clientId: string;
            nutritionistId: string;
            startDate: Date;
            endDate: Date | null;
            monthlyPrice: number;
        };
        meals: ({
            foods: ({
                food: {
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
                };
            } & {
                id: string;
                mealId: string;
                foodId: string;
                quantity: number;
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.MealType;
            description: string | null;
            mealPlanId: string;
            calories: number | null;
            proteins: number | null;
            carbs: number | null;
            fats: number | null;
            suggestedTime: string | null;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        description: string | null;
        nutritionistId: string;
        startDate: Date;
        endDate: Date;
        contractId: string;
    }>;
    static update(id: string, data: Partial<CreateMealPlanData>, userId: string, role: string): Promise<{
        contract: {
            client: {
                email: string;
                password: string;
                id: string;
                name: string;
                role: import(".prisma/client").$Enums.UserRole;
                avatar: string | null;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            nutritionist: {
                user: {
                    email: string;
                    password: string;
                    id: string;
                    name: string;
                    role: import(".prisma/client").$Enums.UserRole;
                    avatar: string | null;
                    phone: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                specialty: string | null;
                experience: number | null;
                bio: string | null;
                pricePerHour: number | null;
                isActive: boolean;
                userId: string;
                crn: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ContractStatus;
            clientId: string;
            nutritionistId: string;
            startDate: Date;
            endDate: Date | null;
            monthlyPrice: number;
        };
        meals: ({
            foods: ({
                food: {
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
                };
            } & {
                id: string;
                mealId: string;
                foodId: string;
                quantity: number;
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.MealType;
            description: string | null;
            mealPlanId: string;
            calories: number | null;
            proteins: number | null;
            carbs: number | null;
            fats: number | null;
            suggestedTime: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        description: string | null;
        nutritionistId: string;
        startDate: Date;
        endDate: Date;
        contractId: string;
    }>;
    static delete(id: string, userId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        description: string | null;
        nutritionistId: string;
        startDate: Date;
        endDate: Date;
        contractId: string;
    }>;
    static addMeal(data: CreateMealData, userId: string, role: string, limits?: NutritionalLimits): Promise<({
        foods: ({
            food: {
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
            };
        } & {
            id: string;
            mealId: string;
            foodId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MealType;
        description: string | null;
        mealPlanId: string;
        calories: number | null;
        proteins: number | null;
        carbs: number | null;
        fats: number | null;
        suggestedTime: string | null;
    }) | null>;
    static updateMeal(mealId: string, data: UpdateMealData, userId: string, role: string, limits?: NutritionalLimits): Promise<({
        foods: ({
            food: {
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
            };
        } & {
            id: string;
            mealId: string;
            foodId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MealType;
        description: string | null;
        mealPlanId: string;
        calories: number | null;
        proteins: number | null;
        carbs: number | null;
        fats: number | null;
        suggestedTime: string | null;
    }) | null>;
    static copyPlan(options: CopyPlanOptions, userId: string, role: string): Promise<({
        meals: ({
            foods: ({
                food: {
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
                };
            } & {
                id: string;
                mealId: string;
                foodId: string;
                quantity: number;
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.MealType;
            description: string | null;
            mealPlanId: string;
            calories: number | null;
            proteins: number | null;
            carbs: number | null;
            fats: number | null;
            suggestedTime: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        description: string | null;
        nutritionistId: string;
        startDate: Date;
        endDate: Date;
        contractId: string;
    }) | null>;
    static recalculatePlanNutrition(mealPlanId: string, userId: string, role: string): Promise<{
        success: boolean;
        recalculatedMeals: number;
    }>;
    private static calculateMealNutrition;
    static getPlanStatistics(mealPlanId: string, userId: string, role: string): Promise<{
        totalMeals: number;
        dailyNutrition: {
            calories: number;
            proteins: number;
            carbs: number;
            fats: number;
        };
        mealDistribution: {
            BREAKFAST: number;
            MORNING_SNACK: number;
            LUNCH: number;
            AFTERNOON_SNACK: number;
            DINNER: number;
            EVENING_SNACK: number;
        };
        planDuration: number;
    }>;
}
//# sourceMappingURL=meal-plan.service.d.ts.map