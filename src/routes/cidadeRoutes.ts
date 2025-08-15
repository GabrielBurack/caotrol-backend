import { Router } from 'express';
import cidadeController from '../controllers/cidadeController';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const cidadeRouter = Router();

// Rota aninhada para buscar cidades de um estado específico
cidadeRouter.get('/estados/:id_estado/cidades', authMiddleware, cidadeController.findAllByEstado);

// Rota para criar uma nova cidade (apenas admin)
cidadeRouter.post('/cidades', authMiddleware, adminAuthMiddleware, cidadeController.create);

export default cidadeRouter;