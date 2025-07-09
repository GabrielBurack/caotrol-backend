import cron from 'node-cron';
import prisma from '../prisma';
import { status_agenda_enum } from '@prisma/client';

class TarefasAgendadasService {
  
  /**
   * Procura por agendamentos que ocorrerão em 2 dias e muda seu status
   * de 'agendada' para 'pendente'.
   */
  public async atualizarStatusParaPendente() {
    console.log('Executando tarefa: Verificando agendamentos para atualizar status para "pendente"...');

    // 1. Calcula a data alvo (exatamente 2 dias a partir de hoje)
    const hoje = new Date();
    const dataAlvoInicio = new Date(hoje);
    dataAlvoInicio.setDate(hoje.getDate() + 2);
    dataAlvoInicio.setHours(0, 0, 0, 0); // Início do dia alvo

    const dataAlvoFim = new Date(dataAlvoInicio);
    dataAlvoFim.setHours(23, 59, 59, 999); // Fim do dia alvo

    try {
      // 2. Encontra todos os agendamentos que correspondem à condição
      const agendamentosParaAtualizar = await prisma.agendamento.findMany({
        where: {
          status: status_agenda_enum.agendada,
          data_exec: {
            gte: dataAlvoInicio,
            lte: dataAlvoFim,
          },
        },
      });

      if (agendamentosParaAtualizar.length > 0) {
        const idsParaAtualizar = agendamentosParaAtualizar.map(ag => ag.id_agenda);

        // 3. Atualiza todos eles de uma só vez para 'pendente'
        await prisma.agendamento.updateMany({
          where: {
            id_agenda: {
              in: idsParaAtualizar,
            },
          },
          data: {
            status: status_agenda_enum.pendente,
          },
        });
        console.log(`${idsParaAtualizar.length} agendamento(s) atualizado(s) para "pendente".`);
      } else {
        console.log('Nenhum agendamento para atualizar hoje.');
      }
    } catch (error) {
      console.error('Erro ao executar a tarefa de atualização de status:', error);
    }
  }

  /**
   * Inicia o agendador de tarefas.
   */
  public iniciar() {
    // A expressão '0 1 * * *' significa "executar todo dia à 1h da manhã"
    // (minuto 0, hora 1, qualquer dia do mês, qualquer mês, qualquer dia da semana)
    cron.schedule('0 1 * * *', this.atualizarStatusParaPendente, {
      timezone: "America/Sao_Paulo"
    });

    console.log('Agendador de tarefas iniciado. A verificação de status será feita diariamente à 1h da manhã.');
  }
}

export default new TarefasAgendadasService();