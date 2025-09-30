import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodEmail;
    name: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{
        CLIENT: "CLIENT";
        NUTRITIONIST: "NUTRITIONIST";
    }>;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateNutritionistSchema: z.ZodObject<{
    specialty: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodNumber>;
    bio: z.ZodOptional<z.ZodString>;
    pricePerHour: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const validate: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.d.ts.map