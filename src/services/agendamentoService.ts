import { agendamento, Prisma, status_agenda_enum } from "@prisma/client";
import agendamentoRepository from "../repositories/agendamentoRepository";
import tutorRepository from "../repositories/tutorRepository";
import animalRepository from "../repositories/animalRepository";
import veterinarioRepository from "../repositories/veterinarioRepository";
import { calcularHorariosDisponiveis, HORARIOS_FIXOS } from "../helpers/agendaHelper";
import { BadRequestError, NotFoundError } from "../helpers/ApiError";



type AgendamentoComRelacoes = Prisma.agendamentoGetPayload<{
  include: {
    animal: { select: { nome: true } };
    tutor: { select: { nome: true } };
    veterinario: { select: { nome: true } };
  };
}>;

//**Refatorar o codigo para ficar modularizado.

class AgendamentoService {

  async listarHorariosDisponiveis(
    id_veterinario: number,
    dia: string
  ): Promise<string[]> {
    // ... (validações de veterinário e data continuam as mesmas)

    const inicioDoDia = new Date(dia + "T00:00:00.000");
    const fimDoDia = new Date(dia + "T23:59:59.999");

    // 2. Busca os dados brutos no repositório
    const agendamentosDoDia = await agendamentoRepository.findByDateRange(
      inicioDoDia,
      fimDoDia,
      id_veterinario
    );

    // 3. Delega o cálculo complexo para o helper
    const horariosDisponiveis = calcularHorariosDisponiveis(agendamentosDoDia);

    return horariosDisponiveis;
  }

  /**
   * Valida e cria um novo agendamento em um horário fixo.
   */
  async agendar(data: {
    id_tutor: number;
    id_animal: number;
    id_veterinario: number;
    dia: string;
    horario: string;
    id_usuario: number;
  }): Promise<agendamento> {
    const { id_tutor, id_animal, id_veterinario, dia, horario, id_usuario } =
      data;

    if (!HORARIOS_FIXOS.includes(horario)) {
      throw new Error(
        "O horário selecionado não é um horário de atendimento válido."
      );
    }

    const dataExecucao = new Date(`${dia}T${horario}:00`); 


    // 1. Calcula o limite de 24 horas a partir de agora
    const agora = new Date();
    const limite24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

    // 2. Decide o status inicial com base na data de execução
    let statusInicial: status_agenda_enum = status_agenda_enum.agendada; // Padrão
    if (dataExecucao <= limite24Horas) {
      statusInicial = status_agenda_enum.pendente;
    }

    // 3. Verificação final de conflito 
    const horariosDisponiveis = await this.listarHorariosDisponiveis(
      id_veterinario,
      dia
    );
    if (!horariosDisponiveis.includes(horario)) {
      throw new Error(
        "Conflito: Este horário acabou de ser ocupado. Por favor, escolha outro."
      );
    }

    return agendamentoRepository.create({
      data_agenda: new Date(),
      data_exec: dataExecucao,
      status: statusInicial, 
      tutor: { connect: { id_tutor } },
      animal: { connect: { id_animal } },
      veterinario: { connect: { id_veterinario } },
      usuario: { connect: { id_usuario } },
    });
  }


  /**
   * Confirma um agendamento, alterando seu status para 'confirmada'.
   * @param id - O ID do agendamento a ser confirmado.
   */
  async confirmar(id: number): Promise<agendamento> {
    const agendamento = await agendamentoRepository.findById(id);
    if (!agendamento) {
      throw new Error("Agendamento não encontrado.");
    }

    // Validação: só se pode confirmar um agendamento que está 'agendada'.
    if (
      agendamento.status !== "agendada" &&
      agendamento.status !== "pendente"
    ) {
      throw new Error(
        `Só é possível confirmar um agendamento com status 'agendada' ou 'pendente'.`
      );
    }

    return agendamentoRepository.update(id, {
      status: "confirmada",
      data_conf: new Date(),
    });
  }

  /**
   * Cancela um agendamento, alterando seu status para 'cancelada'.
   * @param id - O ID do agendamento a ser cancelado.
   */
  async cancelar(id: number): Promise<agendamento> {
    // Busca o agendamento
    const agendamento = await agendamentoRepository.findById(id);
    if (!agendamento) {
      throw new Error("Agendamento não encontrado.");
    }

    // Validação: não se pode cancelar algo que já está cancelado.
    if (agendamento.status === "cancelada") {
      throw new Error("Este agendamento já está cancelado.");
    }

    // Chama o repositório para atualizar o status e registrar a data de cancelamento
    return agendamentoRepository.update(id, {
      status: "cancelada",
      data_cancel: new Date(),
    });
  }

  /**
   * Busca todos os agendamentos dentro de um intervalo de datas específico.
   * Ideal para alimentar calendários como o FullCalendar.
   * @param dataInicio - A data de início do período.
   * @param dataFim - A data de fim do período.
   */
  async buscarPorPeriodo(
    dataInicio: Date,
    dataFim: Date
  ): Promise<AgendamentoComRelacoes[]> {
    // A lógica de negócio aqui é simples: apenas repassamos para o repositório.
    // Poderíamos adicionar lógicas de permissão no futuro, se necessário.
    return agendamentoRepository.findByDateRange(
      dataInicio,
      dataFim
    ) as unknown as AgendamentoComRelacoes[];
  }

  async marcarNaoComparecimento(id: number): Promise<agendamento> {
    const agendamento = await agendamentoRepository.findById(id);
    if (!agendamento) {
      throw new NotFoundError("Agendamento não encontrado.");
    }

    // Regra de negócio: só pode marcar falta se o horário já passou
    if (new Date(agendamento.data_exec) > new Date()) {
        throw new BadRequestError("Não é possível marcar falta para um agendamento futuro.");
    }

    // Regra de negócio: não pode marcar falta em algo já cancelado ou realizado
    if (agendamento.status === 'cancelada' || agendamento.id_consulta !== null) {
        throw new BadRequestError("Não é possível marcar falta para um agendamento que já foi cancelado ou realizado.");
    }

    return agendamentoRepository.update(id, {
      status: 'nao_compareceu'
    });
  }

}

export default new AgendamentoService();