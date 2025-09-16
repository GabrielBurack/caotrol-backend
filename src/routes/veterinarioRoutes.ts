import { Router } from 'express';
import veterinarioController from '../controllers/veterinarioController';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const veterinarioRouter = Router();

veterinarioRouter.post('/veterinarios', authMiddleware, adminAuthMiddleware, veterinarioController.create);
veterinarioRouter.get('/veterinarios', authMiddleware, adminAuthMiddleware, veterinarioController.findAll);
veterinarioRouter.get('/veterinarios/:id', authMiddleware, adminAuthMiddleware,veterinarioController.findById);
veterinarioRouter.put('/veterinarios/:id', authMiddleware,adminAuthMiddleware, veterinarioController.update);
veterinarioRouter.delete('/veterinarios/:id', authMiddleware, adminAuthMiddleware, veterinarioController.delete);

export default veterinarioRouter;