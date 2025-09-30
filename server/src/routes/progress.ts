import { Router } from 'express'
import { ProgressController } from '../controllers/progress.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Middleware de autenticação para todas as rotas
router.use(authenticateToken)

// Rotas para o próprio usuário (cliente)
router.post('/', ProgressController.create)                    // POST /progress - Criar registro
router.get('/', ProgressController.getAll)                     // GET /progress - Listar registros
router.get('/stats', ProgressController.getStats)              // GET /progress/stats - Estatísticas
router.get('/chart', ProgressController.getChartData)          // GET /progress/chart - Dados para gráfico
router.get('/:id', ProgressController.getById)                 // GET /progress/:id - Buscar por ID
router.put('/:id', ProgressController.update)                  // PUT /progress/:id - Atualizar
router.delete('/:id', ProgressController.delete)               // DELETE /progress/:id - Excluir

// Rota especial para nutricionistas verem progresso dos clientes
router.get('/client/:clientId', ProgressController.getClientProgress) // GET /progress/client/:clientId

export default router