import { Router } from 'express';
import animalController from '../controllers/animalController';
import consultaController from '../controllers/consultaController';

const animalRouter = Router();

animalRouter.post('/animais', animalController.create);
animalRouter.get('/animais', animalController.findAll);
animalRouter.get('/animais/:id', animalController.findById);
animalRouter.put('/animais/:id', animalController.update);
animalRouter.delete('/animais/:id/deactivate', animalController.deactivate);

animalRouter.get('/animais/:id_animal/consultas', consultaController.buscarConsultasDoAnimal);

export default animalRouter;