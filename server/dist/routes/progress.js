"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("../controllers/progress.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Middleware de autenticação para todas as rotas
router.use(auth_1.authenticateToken);
// Rotas para o próprio usuário (cliente)
router.post('/', progress_controller_1.ProgressController.create); // POST /progress - Criar registro
router.get('/', progress_controller_1.ProgressController.getAll); // GET /progress - Listar registros
router.get('/stats', progress_controller_1.ProgressController.getStats); // GET /progress/stats - Estatísticas
router.get('/chart', progress_controller_1.ProgressController.getChartData); // GET /progress/chart - Dados para gráfico
router.get('/:id', progress_controller_1.ProgressController.getById); // GET /progress/:id - Buscar por ID
router.put('/:id', progress_controller_1.ProgressController.update); // PUT /progress/:id - Atualizar
router.delete('/:id', progress_controller_1.ProgressController.delete); // DELETE /progress/:id - Excluir
// Rota especial para nutricionistas verem progresso dos clientes
router.get('/client/:clientId', progress_controller_1.ProgressController.getClientProgress); // GET /progress/client/:clientId
exports.default = router;
//# sourceMappingURL=progress.js.map