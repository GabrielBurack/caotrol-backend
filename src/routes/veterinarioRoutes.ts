import { Router } from 'express';
import veterinarioController from '../controllers/veterinarioController';
import authMiddleware from '../middlewares/authMiddleware';

const veterinarioRouter = Router();

veterinarioRouter.post('/veterinarios', authMiddleware, veterinarioController.create);
veterinarioRouter.get('/veterinarios', authMiddleware, veterinarioController.findAll);
veterinarioRouter.get('/veterinarios/:id', authMiddleware, veterinarioController.findById);
veterinarioRouter.put('/veterinarios/:id', authMiddleware, veterinarioController.update);
veterinarioRouter.delete('/veterinarios/:id', authMiddleware, veterinarioController.delete);

export default veterinarioRouter;