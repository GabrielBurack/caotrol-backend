import prisma from "../prisma";
import { agendamento, Prisma } from "@prisma/client";

class AgendamentoRepository {
  async create(data: Prisma.agendamentoCreateInput): Promise<agendamento> {
    return prisma.agendamento.create({
      data,
      include: {
        tutor: true,
        animal: true,
        veterinario: true,
        usuario: {
          select: {
            login: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    data: Prisma.agendamentoUpdateInput
  ): Promise<agendamento> {
    return prisma.agendamento.update({
      where: { id_agenda: id },
      data,
      include: {
        tutor: true,
        animal: true,
        veterinario: true,
        usuario: { select: { login: true } },
      },
    });
  }

  async findById(id: number): Promise<agendamento | null> {
    return prisma.agendamento.findUnique({
      where: { id_agenda: id },
      include: {
        tutor: true,
        animal: true,
        veterinario: true,
        usuario: { select: { login: true } },
      },
    });
  }

  /**
   * Busca agendamentos por um intervalo de datas e opcionalmente por veterinário.
   * @param dataInicio - Data de início do intervalo.
   * @param dataFim - Data de fim do intervalo.
   * @param id_veterinario - (Opcional) ID do veterinário para filtrar.
   */
  async findByDateRange(dataInicio: Date, dataFim: Date, id_veterinario?: number): Promise<agendamento[]> {
    return prisma.agendamento.findMany({
      where: {
        // ✅ CORREÇÃO APLICADA AQUI 👇
        data_exec: {
          gte: dataInicio, // gte: Maior ou igual a data de início
          lt: dataFim,     // lt: Menor que a data de fim
        },
        id_veterinario: id_veterinario,
        status: {
          not: 'cancelada'
        }
      },
      include: {
        tutor: { select: { nome: true } },
        animal: { select: { nome: true } },
        veterinario: { select: { nome: true } }
      },
      orderBy: {
        data_exec: 'asc'
      }
    });
  }
  /**
   * Conta os agendamentos de um dia específico com base em diferentes critérios.
   * @param inicioDoDia - O objeto Date para o início do dia (00:00:00).
   * @param fimDoDia - O objeto Date para o fim do dia (23:59:59).
   */
  async getContagensDoDia(inicioDoDia: Date, fimDoDia: Date) {
    const agendados = await prisma.agendamento.count({
      where: {
        data_exec: { gte: inicioDoDia, lte: fimDoDia },
        status: { in: ["agendada", "pendente", "confirmada"] },
      },
    });

    const confirmados = await prisma.agendamento.count({
      where: {
        data_exec: { gte: inicioDoDia, lte: fimDoDia },
        status: "confirmada",
      },
    });

    const atendidos = await prisma.agendamento.count({
      where: {
        data_exec: { gte: inicioDoDia, lte: fimDoDia },
        id_consulta: { not: null }, // Chave para saber se foi atendido
      },
    });

    // Faltas: agendamentos para hoje, cujo horário já passou, não foram cancelados e não geraram consulta.
    const faltas = await prisma.agendamento.count({
      where: {
        data_exec: { gte: inicioDoDia, lt: new Date() }, // Do início do dia até AGORA
        status: { in: ["agendada", "pendente", "confirmada"] },
        id_consulta: null,
      },
    });

    return { agendados, confirmados, atendidos, faltas };
  }

  /**
   * Busca os próximos agendamentos de um dia a partir do horário atual.
   * @param inicio - O horário atual.
   * @param fimDoDia - O objeto Date para o fim do dia.
   * @param id_veterinario - (Opcional) para filtrar por veterinário.
   */
  async getProximosAgendamentos(
    inicio: Date,
    fimDoDia: Date,
    id_veterinario?: number
  ) {
    return prisma.agendamento.findMany({
      where: {
        data_exec: { gte: inicio, lte: fimDoDia },
        status: { not: "cancelada" },
        id_veterinario: id_veterinario, // Prisma ignora se for undefined
      },
      orderBy: { data_exec: "asc" },
      include: {
        animal: { select: { nome: true } },
        tutor: { select: { nome: true } },
        veterinario: { select: { nome: true } },
      },
    });
  }
}

export default new AgendamentoRepository();
