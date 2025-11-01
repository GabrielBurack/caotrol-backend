import { Router } from 'express';
import helpController from '../controllers/helpController'; // 'helpController' já é a instância
import authMiddleware from '../middlewares/authMiddleware';

const helpRouter = Router();

// Use o 'helpController' importado diretamente
helpRouter.get('/help/:pageKey', authMiddleware, helpController.getHelpContent);

export default helpRouter;