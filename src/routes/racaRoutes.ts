import { Router } from 'express';
import racaController from '../controllers/racaController';
import authMiddleware from '../middlewares/authMiddleware';

const racaRouter = Router();

racaRouter.post('/racas', authMiddleware, racaController.create);
racaRouter.get('/racas', authMiddleware, racaController.findAll);
racaRouter.get('/racas/:id', authMiddleware, racaController.findById);
racaRouter.put('/racas/:id', authMiddleware, racaController.update);
racaRouter.delete('/racas/:id', authMiddleware, racaController.delete);

export default racaRouter;