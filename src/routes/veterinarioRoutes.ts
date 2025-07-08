import { Router } from 'express';
import veterinarioController from '../controllers/veterinarioController';

const veterinarioRouter = Router();

veterinarioRouter.post('/veterinarios', veterinarioController.create);
veterinarioRouter.get('/veterinarios', veterinarioController.findAll);
veterinarioRouter.get('/veterinarios/:id', veterinarioController.findById);
veterinarioRouter.put('/veterinarios/:id', veterinarioController.update);
veterinarioRouter.delete('/veterinarios/:id', veterinarioController.delete);

export default veterinarioRouter;