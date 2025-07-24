// src/routes/dashboardRoutes.ts
import { Router } from 'express';
import dashboardController from '../controllers/dashboardController';
import authMiddleware from '../middlewares/authMiddleware';

const dashboardRouter = Router();

// A rota do dashboard deve ser protegida, pois contém informações sensíveis
dashboardRouter.get('/dashboard', dashboardController.getData);

export default dashboardRouter;