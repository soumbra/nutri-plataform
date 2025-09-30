"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
class AuthService {
    static async login({ email, password }) {
        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                clientProfile: true,
                nutritionistProfile: true
            }
        });
        if (!user) {
            throw new Error('Credenciais inválidas');
        }
        // Verificar senha
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Credenciais inválidas');
        }
        // Gerar token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword
        };
    }
    static async register(data) {
        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('Usuário já existe com este email');
        }
        // Hash da senha
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        // Criar usuário
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                role: data.role,
                phone: data.phone
            }
        });
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword
        };
    }
    static async getUserById(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                clientProfile: true,
                nutritionistProfile: true
            }
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map