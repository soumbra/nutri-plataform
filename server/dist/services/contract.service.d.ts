import { ContractStatus } from '@prisma/client';
export interface CreateContractData {
    clientId: string;
    nutritionistId: string;
    monthlyPrice: number;
    endDate?: Date;
}
export interface ContractFilters {
    status?: ContractStatus;
    clientId?: string;
    nutritionistId?: string;
}
export declare class ContractService {
    static create(data: CreateContractData): Promise<{
        client: {
            email: string;
            id: string;
            name: string;
            phone: string | null;
        };
        nutritionist: {
            user: {
                email: string;
                id: string;
                name: string;
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
    }>;
    static getAll(filters?: ContractFilters): Promise<({
        mealPlans: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            title: string;
        }[];
        client: {
            email: string;
            id: string;
            name: string;
            phone: string | null;
        };
        nutritionist: {
            user: {
                email: string;
                id: string;
                name: string;
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
    })[]>;
    static getById(id: string): Promise<{
        mealPlans: {
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
        client: {
            email: string;
            id: string;
            name: string;
            phone: string | null;
        };
        nutritionist: {
            user: {
                email: string;
                id: string;
                name: string;
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
    }>;
    static updateStatus(id: string, status: ContractStatus): Promise<{
        client: {
            email: string;
            id: string;
            name: string;
            phone: string | null;
        };
        nutritionist: {
            user: {
                email: string;
                id: string;
                name: string;
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
    }>;
    static getByUserRole(userId: string, userRole: 'CLIENT' | 'NUTRITIONIST'): Promise<({
        mealPlans: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            title: string;
        }[];
        client: {
            email: string;
            id: string;
            name: string;
            phone: string | null;
        };
        nutritionist: {
            user: {
                email: string;
                id: string;
                name: string;
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
    })[]>;
    static delete(id: string): Promise<void>;
}
//# sourceMappingURL=contract.service.d.ts.map