import { Router } from 'express';
import anamneseController from '../controllers/anamneseController';
import authMiddleware from '../middlewares/authMiddleware';

const anamneseRouter = Router();

anamneseRouter.post('/consultas/:id_consulta/anamnese', authMiddleware, anamneseController.create);
anamneseRouter.get('/animais/id_animal/anamneses', authMiddleware, anamneseController.findAllByAnimalId);


export default anamneseRouter;