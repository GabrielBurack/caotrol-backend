import { Router } from 'express';
import anamneseController from '../controllers/anamneseController';

const anamneseRouter = Router();

anamneseRouter.post('/consultas/:id_consulta/anamnese', anamneseController.create);

export default anamneseRouter;