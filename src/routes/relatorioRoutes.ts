import { Router } from 'express';
import relatorioController from '../controllers/relatorioController';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const relatorioRouter = Router();

relatorioRouter.get(
    '/relatorios/consultas-por-periodo', 
    authMiddleware, 
    adminAuthMiddleware, 
    relatorioController.getRelatorioConsultas);

export default relatorioRouter;