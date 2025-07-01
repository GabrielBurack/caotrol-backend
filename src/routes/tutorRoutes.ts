import { Router } from "express";
import tutorController from "../controllers/tutorController";

const tutorRouter = Router();

tutorRouter.get('/tutores', tutorController.findAll);
tutorRouter.post('/tutores', tutorController.create);
tutorRouter.get('/tutores/:id', tutorController.findById);
tutorRouter.put('/tutores/:id', tutorController.update);
tutorRouter.delete('/tutores/:id', tutorController.deactivate);

export default tutorRouter;