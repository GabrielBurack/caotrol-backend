import { Router } from 'express';
import authController from '../controllers/authController';

const authRouter = Router();

authRouter.post('/auth/login', async (req, res, next) => {
  await authController.login(req, res, next);
});

authRouter.post('/auth/forgot-password', authController.forgotPassword);
authRouter.post('/auth/reset-password', authController.resetPassword);

export default authRouter;