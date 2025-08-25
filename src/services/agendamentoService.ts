import { agendamento, Prisma, status_agenda_enum } from "@prisma/client";
import agendamentoRepository from "../repositories/agendamentoRepository";
import tutorRepository from "../repositories/tutorRepository";
import animalRepository from "../repositories/animalRepository";
import veterinarioRepository from "../repositories/veterinarioRepository";
import {
  calcularHorariosDisponiveis,
  HORARIOS_FIXOS,
} from "../helpers/agendaHelper";
import { BadRequestError, NotFoundError } from "../helpers/ApiError";

// O tipo específico para o retorno do calendário
type AgendamentoComRelacoes = Prisma.agendamentoGetPayload<{
  select: {
    id_agenda: true;
    data_exec: true;
    status: true;
    id_consulta: true;
    id_animal: true;
    id_tutor: true;
    animal: { select: { nome: true } };
    tutor: { select: { nome: true } };
    veterinario: { select: { nome: true } };
  };
}>;

class AgendamentoService {
  async listarHorariosDisponiveis(
    id_veterinario_str: string,
    dia: string
  ): Promise<string[]> {
    if (!id_veterinario_str || !dia) {
      throw new BadRequestError(
        "Os parâmetros id_veterinario e dia são obrigatórios."
      );
    }
    const id_veterinario = parseInt(id_veterinario_str);
    if (isNaN(id_veterinario)) {
      throw new BadRequestError("O ID do veterinário deve ser um número.");
    }

    const veterinario = await veterinarioRepository.findById(id_veterinario);
    if (!veterinario) throw new NotFoundError("Veterinário não encontrado.");

    const dataSelecionada = new Date(dia + "T00:00:00");
    if (dataSelecionada < new Date(new Date().toDateString())) {
      throw new BadRequestError(
        "Não é possível consultar horários para datas passadas."
      );
    }

    const inicioDoDia = new Date(dia + "T00:00:00.000");
    const fimDoDia = new Date(dia + "T23:59:59.999");

    const agendamentosDoDia = await agendamentoRepository.findByDateRange(
      inicioDoDia,
      fimDoDia,
      id_veterinario
    );
    return calcularHorariosDisponiveis(agendamentosDoDia);
  }

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

    if (!(await tutorRepository.findById(id_tutor)))
      throw new NotFoundError("Tutor não encontrado.");
    if (!(await animalRepository.findById(id_animal)))
      throw new NotFoundError("Animal não encontrado.");

    if (!HORARIOS_FIXOS.includes(horario)) {
      throw new BadRequestError(
        "O horário selecionado não é um horário de atendimento válido."
      );
    }

    const dataExecucao = new Date(`${dia}T${horario}:00`);


    if (dataExecucao <= new Date()) {
      throw new BadRequestError(
        "A data de execução do agendamento deve ser no futuro."
      );
    }

    const agora = new Date();
    const limite24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

    let statusInicial: status_agenda_enum = status_agenda_enum.agendada;
    if (dataExecucao <= limite24Horas) {
      statusInicial = status_agenda_enum.pendente;
    }

    const horariosDisponiveis = await this.listarHorariosDisponiveis(
      id_veterinario.toString(),
      dia
    );
    if (!horariosDisponiveis.includes(horario)) {
      throw new BadRequestError(
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

  async findById(id: number): Promise<agendamento> {
    if (isNaN(id))
      throw new BadRequestError("O ID do agendamento deve ser um número.");
    const agendamento = await agendamentoRepository.findById(id);
    if (!agendamento) throw new NotFoundError("Agendamento não encontrado.");
    return agendamento;
  }

  async confirmar(id: number): Promise<agendamento> {
    const agendamento = await this.findById(id);

    if (
      agendamento.status !== "agendada" &&
      agendamento.status !== "pendente"
    ) {
      throw new BadRequestError(
        `Só é possível confirmar um agendamento com status 'agendada' ou 'pendente'.`
      );
    }

    return agendamentoRepository.update(id, {
      status: "confirmada",
      data_conf: new Date(),
    });
  }

  async cancelar(id: number): Promise<agendamento> {
    const agendamento = await this.findById(id);

    if (agendamento.status === "cancelada") {
      throw new BadRequestError("Este agendamento já está cancelado.");
    }

    return agendamentoRepository.update(id, {
      status: "cancelada",
      data_cancel: new Date(),
    });
  }

  async buscarPorPeriodo(start?: string, end?: string) {
    if (!start || !end) {
      throw new BadRequestError(
        'Os parâmetros "start" e "end" são obrigatórios.'
      );
    }
    const dataInicio = new Date(start);
    const dataFim = new Date(end);

    const agendamentos = (await agendamentoRepository.findByDateRange(
      dataInicio,
      dataFim
    )) as AgendamentoComRelacoes[];

    // A formatação dos dados para o frontend é uma responsabilidade do Service
    return agendamentos.map((ag) => ({
      id: ag.id_agenda,
      title: `${ag.animal.nome} - ${ag.tutor.nome}`,
      start: ag.data_exec,
      extendedProps: {
        veterinario: ag.veterinario.nome,
        status: ag.status,
        realizada: ag.id_consulta !== null,
        id_animal: ag.id_animal,
        id_tutor: ag.id_tutor,
      },
      color: ag.status === 'confirmada' ? '#28a745' : (['pendente', 'agendada'].includes(ag.status) ? '#ffc107' : ag.status === 'nao_compareceu' ? '#dc3545' : '#007bff')
    }));
  }

  async marcarNaoComparecimento(id: number): Promise<agendamento> {
    const agendamento = await this.findById(id);

    if (new Date(agendamento.data_exec) > new Date()) {
      throw new BadRequestError(
        "Não é possível marcar falta para um agendamento futuro."
      );
    }

    if (
      agendamento.status === "cancelada" ||
      agendamento.id_consulta !== null
    ) {
      throw new BadRequestError(
        "Não é possível marcar falta para um agendamento que já foi cancelado ou realizado."
      );
    }

    return agendamentoRepository.update(id, {
      status: "nao_compareceu",
    });
  }
}

export default new AgendamentoService();