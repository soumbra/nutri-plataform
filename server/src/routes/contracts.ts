import { Router } from 'express'
import { ContractController } from '../controllers/contract.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Middleware de autenticação para todas as rotas
router.use(authenticateToken)

// POST /api/contracts - Criar novo contrato (apenas clientes)
router.post('/', ContractController.create)

// GET /api/contracts - Listar contratos do usuário
router.get('/', ContractController.getAll)

// GET /api/contracts/:id - Buscar contrato específico
router.get('/:id', ContractController.getById)

// PATCH /api/contracts/:id/status - Atualizar status do contrato
router.patch('/:id/status', ContractController.updateStatus)

// ⚠️ APENAS PARA DESENVOLVIMENTO - Remover em produção
// DELETE /api/contracts/:id - Excluir contrato
router.delete('/:id', ContractController.delete)

export default router