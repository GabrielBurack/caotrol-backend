import { agendamento, Prisma } from "@prisma/client";
import agendamentoRepository from "../repositories/agendamentoRepository";
import tutorRepository from "../repositories/tutorRepository";
import animalRepository from "../repositories/animalRepository";
import veterinarioRepository from "../repositories/veterinarioRepository";

const HORARIOS_FIXOS = [
  "09:00",

  "10:00",

  "11:00",

  "12:00",

  "14:00",

  "15:00",

  "16:00",

  "17:00",

  "18:00",
];

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
    // Valida se o veterinário existe
    const veterinario = await veterinarioRepository.findById(id_veterinario);
    if (!veterinario) throw new Error("Veterinário não encontrado.");

    // Define o início e o fim do dia para a consulta no banco
    const dataSelecionada = new Date(dia + "T00:00:00");
    if (dataSelecionada < new Date(new Date().toDateString())) {
      throw new Error("Não é possível consultar horários para datas passadas.");
    }

    const inicioDoDia = new Date(dia + "T00:00:00.000");
    const fimDoDia = new Date(dia + "T23:59:59.999");

    // Busca todos os agendamentos já existentes para o veterinário naquele dia
    const agendamentosDoDia = await agendamentoRepository.findByDateRange(
      inicioDoDia,
      fimDoDia,
      id_veterinario
    );

    // Extrai apenas a hora dos agendamentos existentes (ex: "09:00", "14:00")
    const horariosOcupados = new Set(
      agendamentosDoDia.map((ag) => {
        // Formata a data para pegar a hora no fuso horário local correto
        return new Date(ag.data_exec).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        });
      })
    );

    // Filtra a lista de horários fixos, retornando apenas os que NÃO estão ocupados
    const horariosDisponiveis = HORARIOS_FIXOS.filter(
      (horario) => !horariosOcupados.has(horario)
    );

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

    // 1. Validação do horário
    if (!HORARIOS_FIXOS.includes(horario)) {
      throw new Error(
        "O horário selecionado não é um horário de atendimento válido."
      );
    }

    // Combina data e horário para criar o objeto Date completo
    const dataExecucao = new Date(`${dia}T${horario}:00`);

    // 2. Reutiliza as validações que já tínhamos
    const tutor = await tutorRepository.findById(id_tutor);
    if (!tutor) throw new Error("Tutor não encontrado.");
    const animal = await animalRepository.findById(id_animal);
    if (!animal) throw new Error("Animal não encontrado.");
    if (animal.id_tutor !== tutor.id_tutor) {
      throw new Error("Este animal não pertence ao tutor informado.");
    }
    if (dataExecucao <= new Date()) {
      throw new Error("A data de execução do agendamento deve ser no futuro.");
    }

    // 3. Verificação final de conflito (para evitar que dois usuários agendem ao mesmo tempo)
    const horariosDisponiveis = await this.listarHorariosDisponiveis(
      id_veterinario,
      dia
    );
    if (!horariosDisponiveis.includes(horario)) {
      throw new Error(
        "Conflito: Este horário acabou de ser ocupado. Por favor, escolha outro."
      );
    }

    // 4. Criação do agendamento
    return agendamentoRepository.create({
      data_agenda: new Date(),
      data_exec: dataExecucao,
      status: "agendada",
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
}

export default new AgendamentoService();
