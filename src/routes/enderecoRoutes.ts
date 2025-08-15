import { Router } from 'express';
import enderecoController from '../controllers/enderecoController';
import authMiddleware from '../middlewares/authMiddleware';

const enderecoRouter = Router();

// Endpoint para buscar endereço por CEP
enderecoRouter.get('/enderecos/cep/:cep', authMiddleware, enderecoController.findByCep);

export default enderecoRouter;