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
            login: true
          }
        }
      }
    });
  }

  async update(id: number, data: Prisma.agendamentoUpdateInput): Promise<agendamento> {
    return prisma.agendamento.update({
      where: { id_agenda: id },
      data,
      include: {
        tutor: true,
        animal: true,
        veterinario: true,
        usuario: { select: { login: true } }
      }
    });
  }

  async findById(id: number): Promise<agendamento | null> {
    return prisma.agendamento.findUnique({
      where: { id_agenda: id },
      include: {
        tutor: true,
        animal: true,
        veterinario: true,
        usuario: { select: { login: true } }
      }
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
            data_exec: {
                gte: dataInicio, // gte: Greater Than or Equal (Maior ou igual a)
                lte: dataFim,    // lte: Less Than or Equal (Menor ou igual a)
            },
            id_veterinario: id_veterinario, // Se id_veterinario for undefined, o Prisma ignora o filtro
            // Filtramos para não incluir agendamentos cancelados na visualização da agenda
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
}

export default new AgendamentoRepository();