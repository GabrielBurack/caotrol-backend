import { Router } from 'express';
import animalController from '../controllers/animalController';
import consultaController from '../controllers/consultaController';
import authMiddleware from '../middlewares/authMiddleware';

const animalRouter = Router();

animalRouter.post('/animais', authMiddleware, animalController.create);
animalRouter.get('/animais', authMiddleware, animalController.findAll);
animalRouter.get('/animais/:id', authMiddleware, animalController.findById);
animalRouter.put('/animais/:id', authMiddleware, animalController.update);
//animalRouter.delete('/animais/:id/deactivate', authMiddleware, animalController.deactivate);

animalRouter.delete('/animais/:id', authMiddleware, animalController.deactivate);

animalRouter.get('/animais/:id_animal/consultas', authMiddleware, consultaController.buscarConsultasDoAnimal);
animalRouter.get('/tutores/:id_tutor/animais', authMiddleware, animalController.findAllByTutor);

export default animalRouter;