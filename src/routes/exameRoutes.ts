import { Router } from 'express';
import exameController from '../controllers/exameController';
import authMiddleware from '../middlewares/authMiddleware';

const exameRouter = Router();

exameRouter.get('/animais/:id_animal/exames', authMiddleware, exameController.findAllByAnimal);
exameRouter.patch('/exames/:id_exame', authMiddleware, exameController.update);
exameRouter.delete('/exames/:id_exame', authMiddleware, exameController.delete);

export default exameRouter;