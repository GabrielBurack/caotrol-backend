import { Request, Response } from 'express';
import agendamentoService from '../services/agendamentoService';
import { Prisma } from '@prisma/client';

// 2. Crie um tipo mais específico para o agendamento com os dados incluídos
type AgendamentoComRelacoes = Prisma.agendamentoGetPayload<{
  include: {
    animal: { select: { nome: true } };
    tutor: { select: { nome: true } };
    veterinario: { select: { nome: true } };
  };
}>;

class AgendamentoController {

  /**
   * Lista os horários disponíveis para um veterinário em um dia específico.
   * @query {string} id_veterinario - ID do veterinário.
   * @query {string} dia - Dia no formato YYYY-MM-DD.
   */
  async listarHorariosDisponiveis(req: Request, res: Response): Promise<void> {
    try {
      const id_veterinario = parseInt(req.query.id_veterinario as string);
      const dia = req.query.dia as string;

      // Validação mais robusta dos parâmetros
      if (isNaN(id_veterinario) || !dia) {
        // Correção: ajustado o 'return' e melhorada a validação
        res.status(400).json({ message: 'Os parâmetros id_veterinario (numérico) e dia (texto) são obrigatórios.' });
        return;
      }

      const horarios = await agendamentoService.listarHorariosDisponiveis(id_veterinario, dia);
      res.status(200).json(horarios);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Cria um novo agendamento.
   */
  async agendar(req: Request, res: Response): Promise<void> {
    try {
      const agendamento = await agendamentoService.agendar(req.body);
      res.status(201).json(agendamento);
    } catch (error: any) {
      // Ex: O horário já foi agendado, ou o veterinário não existe.
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Confirma um agendamento existente.
   */
  async confirmar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      // Melhoria: adicionada validação de ID
      if (isNaN(id)) {
        res.status(400).json({ message: 'O ID do agendamento deve ser um número.' });
        return;
      }

      const agendamento = await agendamentoService.confirmar(id);
      res.status(200).json(agendamento);
    } catch (error: any) {
      // Melhoria: trata o erro de agendamento não encontrado
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).json({ message: 'Agendamento não encontrado para confirmação.' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  /**
   * Cancela um agendamento existente.
   */
  async cancelar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      // Melhoria: adicionada validação de ID
      if (isNaN(id)) {
        res.status(400).json({ message: 'O ID do agendamento deve ser um número.' });
        return;
      }

      const agendamento = await agendamentoService.cancelar(id);
      res.status(200).json(agendamento);
    } catch (error: any) {
      // Melhoria: trata o erro de agendamento não encontrado
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).json({ message: 'Agendamento não encontrado para cancelamento.' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  /**
   * Rota para buscar agendamentos para o FullCalendar.
   * Recebe 'start' e 'end' como query params. Ex: /agendamentos?start=2025-07-01&end=2025-07-31
   */
   async buscarPorPeriodo(req: Request, res: Response) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        res.status(400).json({ message: 'Os parâmetros "start" e "end" são obrigatórios.' });
        return
      }

      const dataInicio = new Date(start as string);
      const dataFim = new Date(end as string);

      // 3. Use o novo tipo para 'agendamentos'
      const agendamentos: AgendamentoComRelacoes[] = await agendamentoService.buscarPorPeriodo(dataInicio, dataFim);
      
      const eventos = agendamentos.map(ag => ({
        id: ag.id_agenda,
        title: `${ag.animal.nome} - ${ag.tutor.nome}`, // Agora o TypeScript sabe que 'animal' e 'tutor' existem
        start: ag.data_exec,
        end: new Date(new Date(ag.data_exec).getTime() + 60 * 60 * 1000), 
        extendedProps: {
            veterinario: ag.veterinario.nome,
            status: ag.status
        }
      }));

      res.status(200).json(eventos);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AgendamentoController();