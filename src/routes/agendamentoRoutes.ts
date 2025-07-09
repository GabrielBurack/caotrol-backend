import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController';
import consultaController from '../controllers/consultaController';

const agendamentoRouter = Router();

agendamentoRouter.get('/agendamentos/horarios-disponiveis', agendamentoController.listarHorariosDisponiveis);

agendamentoRouter.post('/agendamentos', agendamentoController.agendar);
agendamentoRouter.patch('/agendamentos/:id/confirmar', agendamentoController.confirmar);
agendamentoRouter.patch('/agendamentos/:id/cancelar', agendamentoController.cancelar);

// Rota para transformar um agendamento em uma consulta
agendamentoRouter.post('/agendamentos/:id_agendamento/consulta', consultaController.registrarConsultaAgendada);

export default agendamentoRouter;