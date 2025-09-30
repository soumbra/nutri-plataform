"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.login({ email, password });
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno'
            });
        }
    }
    static async register(req, res) {
        try {
            const userData = req.body;
            const result = await auth_service_1.AuthService.register(userData);
            res.status(201).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno'
            });
        }
    }
    static async me(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuário não autenticado'
                });
            }
            const user = await auth_service_1.AuthService.getUserById(req.user.userId);
            res.json({
                success: true,
                data: { user }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno'
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map