// src/routes/agendamentoRoutes.ts

import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController';

const agendamentoRouter = Router();

agendamentoRouter.get('/agendamentos/horarios-disponiveis', agendamentoController.listarHorariosDisponiveis);

agendamentoRouter.post('/agendamentos', agendamentoController.agendar);
agendamentoRouter.patch('/agendamentos/:id/confirmar', agendamentoController.confirmar);
agendamentoRouter.patch('/agendamentos/:id/cancelar', agendamentoController.cancelar);

export default agendamentoRouter;