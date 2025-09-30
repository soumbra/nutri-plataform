"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post('/login', (0, validation_1.validate)(validation_1.loginSchema), auth_controller_1.AuthController.login);
// POST /api/auth/register
router.post('/register', (0, validation_1.validate)(validation_1.registerSchema), auth_controller_1.AuthController.register);
// GET /api/auth/me
router.get('/me', auth_1.authenticateToken, auth_controller_1.AuthController.me);
exports.default = router;
//# sourceMappingURL=auth.js.map