"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nutritionist_controller_1 = require("../controllers/nutritionist.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.get('/', nutritionist_controller_1.NutritionistController.getAll);
router.get('/specialties', nutritionist_controller_1.NutritionistController.getSpecialties);
router.get('/:id', nutritionist_controller_1.NutritionistController.getById);
router.get('/profile/me', auth_1.authenticateToken, (0, auth_1.requireRole)(['NUTRITIONIST']), nutritionist_controller_1.NutritionistController.getProfile);
router.put('/profile/me', auth_1.authenticateToken, (0, auth_1.requireRole)(['NUTRITIONIST']), (0, validation_1.validate)(validation_1.updateNutritionistSchema), nutritionist_controller_1.NutritionistController.updateProfile);
exports.default = router;
//# sourceMappingURL=nutritionist.js.map