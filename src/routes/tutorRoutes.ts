import { Router } from "express";
import tutorController from "../controllers/tutorController";
import authMiddleware from "../middlewares/authMiddleware";

const tutorRouter = Router();

tutorRouter.get('/tutores', authMiddleware, tutorController.findAll);
tutorRouter.post('/tutores', authMiddleware, tutorController.create);
tutorRouter.get('/tutores/:id', authMiddleware, tutorController.findById);
tutorRouter.put('/tutores/:id', authMiddleware, tutorController.update);
tutorRouter.delete('/tutores/:id', authMiddleware, tutorController.deactivate);

export default tutorRouter;