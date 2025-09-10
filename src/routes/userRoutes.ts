import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";

const userRouter = Router();

userRouter.post('/usuarios/registrar', authMiddleware, adminAuthMiddleware, userController.register);
userRouter.get('/usuarios', authMiddleware, adminAuthMiddleware, userController.findAll);
userRouter.patch('/usuarios/:id', authMiddleware, adminAuthMiddleware, userController.update);

export default userRouter;