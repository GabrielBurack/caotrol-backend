import { Router } from 'express';
import consultaController from '../controllers/consultaController';
import authMiddleware from '../middlewares/authMiddleware';

const consultaRouter = Router();

// Rota para criar uma consulta de encaixe (sem agendamento)
consultaRouter.post('/consultas', authMiddleware, consultaController.registrarConsultaSemAgendamento);

// Rota para buscar uma consulta específica por seu ID
consultaRouter.get('/consultas/:id_consulta', authMiddleware, consultaController.buscarPorId);

export default consultaRouter;