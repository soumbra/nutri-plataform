"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.updateNutritionistSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email({ message: 'Email inválido' }),
    password: zod_1.z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.email({ message: 'Email inválido' }),
    name: zod_1.z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    password: zod_1.z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
    role: zod_1.z.enum(['CLIENT', 'NUTRITIONIST']),
    phone: zod_1.z.string().optional()
});
exports.updateNutritionistSchema = zod_1.z.object({
    specialty: zod_1.z.string().optional(),
    experience: zod_1.z.number().min(0).max(50).optional(),
    bio: zod_1.z.string().max(1000).optional(),
    pricePerHour: zod_1.z.number().min(0).max(1000).optional(),
    isActive: zod_1.z.boolean().optional()
});
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    error: 'Dados inválidos',
                    details: error.issues
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.js.map