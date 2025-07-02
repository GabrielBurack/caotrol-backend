import { Router } from 'express';
import especieController from '../controllers/especieController';

const especieRouter = Router();

especieRouter.post('/especies', especieController.create);
especieRouter.get('/especies', especieController.findAll);
especieRouter.get('/especies/:id', especieController.findById);
especieRouter.put('/especies/:id', especieController.update);
especieRouter.delete('/especies/:id', especieController.delete);

export default especieRouter;