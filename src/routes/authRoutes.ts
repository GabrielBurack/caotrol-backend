import { Router } from 'express';
import authController from '../controllers/authController';

const authRouter = Router();

authRouter.post('/auth/login', async (req, res, next) => {
  await authController.login(req, res, next);
});

export default authRouter;