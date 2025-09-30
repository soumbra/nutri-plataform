"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contract_controller_1 = require("../controllers/contract.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Middleware de autenticação para todas as rotas
router.use(auth_1.authenticateToken);
// POST /api/contracts - Criar novo contrato (apenas clientes)
router.post('/', contract_controller_1.ContractController.create);
// GET /api/contracts - Listar contratos do usuário
router.get('/', contract_controller_1.ContractController.getAll);
// GET /api/contracts/:id - Buscar contrato específico
router.get('/:id', contract_controller_1.ContractController.getById);
// PATCH /api/contracts/:id/status - Atualizar status do contrato
router.patch('/:id/status', contract_controller_1.ContractController.updateStatus);
// ⚠️ APENAS PARA DESENVOLVIMENTO - Remover em produção
// DELETE /api/contracts/:id - Excluir contrato
router.delete('/:id', contract_controller_1.ContractController.delete);
exports.default = router;
//# sourceMappingURL=contracts.js.map