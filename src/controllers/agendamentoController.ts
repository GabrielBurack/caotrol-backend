import { Request, Response } from 'express';
import agendamentoService from '../services/agendamentoService';

class AgendamentoController {
  
  /**
   * Rota para listar os horários disponíveis.
   * Recebe id_veterinario e dia via query params. Ex: /horarios-disponiveis?id_veterinario=1&dia=2025-07-30
   */
  async listarHorariosDisponiveis(req: Request, res: Response) {
    try {
      const id_veterinario = parseInt(req.query.id_veterinario as string);
      const dia = req.query.dia as string;

      if (!id_veterinario || !dia) {
        return res.status(400).json({ message: 'Os parâmetros id_veterinario e dia são obrigatórios.' });
      }

      const horarios = await agendamentoService.listarHorariosDisponiveis(id_veterinario, dia);
      res.status(200).json(horarios);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Rota para criar um novo agendamento.
   * Recebe os dados no corpo da requisição.
   */
  async agendar(req: Request, res: Response) {
    try {
      // Em um sistema real, o id_usuario viria de um token de autenticação (JWT)
      // Por enquanto, vamos assumir que ele vem no corpo da requisição.
      const agendamento = await agendamentoService.agendar(req.body);
      res.status(201).json(agendamento);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Rota para confirmar um agendamento.
   * Recebe o ID do agendamento via params.
   */
  async confirmar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const agendamento = await agendamentoService.confirmar(id);
      res.status(200).json(agendamento);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Rota para cancelar um agendamento.
   * Recebe o ID do agendamento via params.
   */
  async cancelar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const agendamento = await agendamentoService.cancelar(id);
      res.status(200).json(agendamento);
    } catch (error: any)
    {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AgendamentoController();