import { Router } from 'express';
import consultaController from '../controllers/consultaController';

const consultaRouter = Router();

// Rota para criar uma consulta de encaixe (sem agendamento)
consultaRouter.post('/consultas', consultaController.registrarConsultaSemAgendamento);

// Rota para buscar uma consulta específica por seu ID
consultaRouter.get('/consultas/:id_consulta', consultaController.buscarPorId);

export default consultaRouter;