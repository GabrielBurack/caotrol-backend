import { Router } from 'express';
import documentoController from '../controllers/documentoController';
import authMiddleware from '../middlewares/authMiddleware';

const documentoRouter = Router();

// Rota para visualização/impressão ANTES de salvar
documentoRouter.post('/documentos/prescricao/visualizar', authMiddleware, documentoController.gerarPrescricaoPreview);

// Rota para imprimir uma prescrição que JÁ FOI SALVA
documentoRouter.get('/prescricoes/:id_prescricao/imprimir', authMiddleware, documentoController.gerarPrescricao);

// Rota para visualização/impressão de Exame ANTES de salvar
documentoRouter.post('/documentos/exame/visualizar', authMiddleware, documentoController.gerarExamePreview);

// Rota para imprimir uma solicitação de Exame que JÁ FOI SALVA
documentoRouter.get('/exames/:id_exame/imprimir', authMiddleware, documentoController.gerarExame);

export default documentoRouter;