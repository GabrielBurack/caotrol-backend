import { Router } from 'express';
import anamneseController from '../controllers/anamneseController';
import authMiddleware from '../middlewares/authMiddleware';

const anamneseRouter = Router();

anamneseRouter.post('/consultas/:id_consulta/anamnese', authMiddleware, anamneseController.create);

export default anamneseRouter;