import { Router } from 'express';
import prescricaoController from '../controllers/prescricaoController';
import authMiddleware from '../middlewares/authMiddleware';

const prescricaoRouter = Router();

prescricaoRouter.get('/animais/:id_animal/prescricoes', authMiddleware, prescricaoController.findAllByAnimal);
prescricaoRouter.patch('/prescricoes/:id_prescricao', authMiddleware, prescricaoController.update);
prescricaoRouter.delete('/prescricoes/:id_prescricao', authMiddleware, prescricaoController.delete);

export default prescricaoRouter;