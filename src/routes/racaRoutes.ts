import { Router } from 'express';
import racaController from '../controllers/racaController';

const racaRouter = Router();

racaRouter.post('/racas', racaController.create);
racaRouter.get('/racas', racaController.findAll);
racaRouter.get('/racas/:id', racaController.findById);
racaRouter.put('/racas/:id', racaController.update);
racaRouter.delete('/racas/:id', racaController.delete);

export default racaRouter;