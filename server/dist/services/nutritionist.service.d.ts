export interface NutritionistFilters {
    specialty?: string;
    minPrice?: number;
    maxPrice?: number;
    experience?: number;
    location?: string;
    search?: string;
}
export declare class NutritionistService {
    static getAll(filters?: NutritionistFilters): Promise<({
        user: {
            email: string;
            id: string;
            name: string;
            avatar: string | null;
            phone: string | null;
            createdAt: Date;
        };
        _count: {
            contracts: number;
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
    })[]>;
    static getById(id: string): Promise<{
        contracts: {
            id: string;
            startDate: Date;
            client: {
                name: string;
            };
        }[];
        user: {
            email: string;
            id: string;
            name: string;
            avatar: string | null;
            phone: string | null;
            createdAt: Date;
        };
        _count: {
            contracts: number;
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
    }>;
    static getByUserId(userId: string): Promise<({
        contracts: ({
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
        })[];
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
        _count: {
            contracts: number;
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
    }) | null>;
    static updateProfile(userId: string, data: {
        specialty?: string;
        experience?: number;
        bio?: string;
        pricePerHour?: number;
        isActive?: boolean;
    }): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            avatar: string | null;
            phone: string | null;
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
    }>;
    static getSpecialties(): Promise<string[]>;
}
//# sourceMappingURL=nutritionist.service.d.ts.map