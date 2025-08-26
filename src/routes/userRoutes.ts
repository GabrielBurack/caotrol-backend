import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";

const userRouter = Router();

userRouter.post('/usuarios/registrar',  userController.register);
userRouter.get('/usuarios',  userController.findAll);

export default userRouter;