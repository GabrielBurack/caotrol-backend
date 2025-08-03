import { Router } from 'express';
import especieController from '../controllers/especieController';
import authMiddleware from '../middlewares/authMiddleware';

const especieRouter = Router();

especieRouter.post('/especies', authMiddleware, especieController.create);
especieRouter.get('/especies', authMiddleware, especieController.findAll);
especieRouter.get('/especies/:id', authMiddleware, especieController.findById);
especieRouter.put('/especies/:id', authMiddleware, especieController.update);
especieRouter.delete('/especies/:id', authMiddleware, especieController.delete);

export default especieRouter;