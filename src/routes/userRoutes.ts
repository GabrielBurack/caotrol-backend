import { Router } from "express";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.post('/usuarios/registrar', userController.register);

export default userRouter;