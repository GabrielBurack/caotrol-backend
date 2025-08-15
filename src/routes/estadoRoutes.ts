import { Router } from 'express';
import estadoController from '../controllers/estadoController';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const estadoRouter = Router();

// A listagem de estados é uma rota que o frontend usará em formulários
estadoRouter.get('/estados', authMiddleware, estadoController.findAll);

// Apenas administradores podem criar novos estados
estadoRouter.post('/estados', authMiddleware, adminAuthMiddleware, estadoController.create);

export default estadoRouter;