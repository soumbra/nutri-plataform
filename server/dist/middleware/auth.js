"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ error: 'Token de acesso requerido' });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ error: 'Token inválido' });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Permissão insuficiente' });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map