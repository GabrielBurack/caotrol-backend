// src/routes/auth.routes.ts - NOVO ARQUIVO
import { Router } from 'express';
import authController from '../controllers/authController';

const authRouter = Router();

authRouter.post('/auth/login', async (req, res) => {
  await authController.login(req, res);
});

export default authRouter;