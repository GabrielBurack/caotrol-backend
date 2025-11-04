import { Router } from 'express';
import helpController from '../controllers/helpController'; 

const helpRouter = Router();

helpRouter.get('/help/:pageKey', helpController.getHelpContent);

export default helpRouter;