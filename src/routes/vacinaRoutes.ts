import { Router } from 'express';
import vacinaController from '../controllers/vacinaController';
import authMiddleware from '../middlewares/authMiddleware';

const vacinaRouter = Router();

vacinaRouter.post('/animais/:id_animal/vacinas', authMiddleware, vacinaController.create);
vacinaRouter.get('/animais/:id_animal/vacinas', authMiddleware, vacinaController.findAllByAnimal);
vacinaRouter.delete('/vacinas/:id_vacina', authMiddleware, vacinaController.delete);

export default vacinaRouter;