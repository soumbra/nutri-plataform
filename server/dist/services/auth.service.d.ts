import { LoginRequest, RegisterRequest } from '../types';
export declare class AuthService {
    static login({ email, password }: LoginRequest): Promise<{
        token: string;
        user: {
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
            nutritionistProfile: {
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
            } | null;
            email: string;
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    static register(data: RegisterRequest): Promise<{
        token: string;
        user: {
            email: string;
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    static getUserById(userId: string): Promise<{
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
        nutritionistProfile: {
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
        } | null;
        email: string;
        id: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map