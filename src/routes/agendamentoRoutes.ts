import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController';
import consultaController from '../controllers/consultaController';
import authMiddleware from '../middlewares/authMiddleware';

const agendamentoRouter = Router();

agendamentoRouter.get('/agendamentos/horarios-disponiveis', authMiddleware, agendamentoController.listarHorariosDisponiveis);

agendamentoRouter.post('/agendamentos', authMiddleware, agendamentoController.agendar);
agendamentoRouter.patch('/agendamentos/:id/confirmar', authMiddleware, agendamentoController.confirmar);
agendamentoRouter.patch('/agendamentos/:id/cancelar', authMiddleware, agendamentoController.cancelar);
agendamentoRouter.get('/agendamentos', authMiddleware, agendamentoController.buscarPorPeriodo);

// Rota para transformar um agendamento em uma consulta
agendamentoRouter.post('/agendamentos/:id_agendamento/consulta', authMiddleware, consultaController.registrarConsultaAgendada);
export default agendamentoRouter;