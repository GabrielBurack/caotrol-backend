import prisma from "../prisma";
import { Prisma, tutor } from "@prisma/client";

class TutorRepository {
  // Criação de novo tutor
  async create(data: Omit<tutor, "id_tutor" | "ativo">): Promise<tutor> {
    return prisma.tutor.create({
      data: {
        ...data,
        ativo: true,
      },
    });
  }

  // Retorna todos os tutores ativos
  async findAll(skip: number, take: number, busca?: string): Promise<tutor[]> {
    const where: Prisma.tutorWhereInput = {
      ativo: true,
    };

    // Lógica de busca dentro da própria função
    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { cpf: { contains: busca } },
      ];
    }

    return prisma.tutor.findMany({
      where: where,
      skip: skip,
      take: take,
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Busca tutores por nome ou CPF para componentes de autocomplete.
   * Retorna uma lista limitada e com dados simplificados.
   * @param termo - O termo de busca.
   * @param limite - O número máximo de resultados a retornar.
   */
  async searchByNameOrCpf(
    termo: string,
    limite = 10
  ): Promise<{ id_tutor: number; nome: string; cpf: string }[]> {
    return prisma.tutor.findMany({
      where: {
        ativo: true,
        // Lógica de busca diretamente na query
        OR: [
          { nome: { contains: termo, mode: 'insensitive' } },
          { cpf: { contains: termo } }
        ]
      },
      take: limite,
      select: {
        id_tutor: true,
        nome: true,
        cpf: true
      }
    });
  }

  // Contar o total de registros
  async countAll(busca?: string): Promise<number> {
    const where: Prisma.tutorWhereInput = {
      ativo: true,
    };

    // Lógica de busca duplicada aqui para a contagem
    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { cpf: { contains: busca } },
      ];
    }

    return prisma.tutor.count({
      where: where,
    });
  }

  // Busca por ID (sem filtro de ativo)
  async findById(id: number): Promise<tutor | null> {
    return prisma.tutor.findUnique({
      where: { id_tutor: id },
    });
  }

  // Busca por CPF (apenas tutores ativos)
  async findByCpf(cpf: string): Promise<tutor | null> {
    return prisma.tutor.findFirst({
      where: {
        cpf,
        ativo: true,
      },
    });
  }

  // Atualização de dados
  async update(id: number, data: Partial<tutor>): Promise<tutor> {
    return prisma.tutor.update({
      where: { id_tutor: id },
      data,
    });
  }

  // Soft delete (marca como inativo)
  async deactivate(id: number): Promise<tutor> {
    return prisma.tutor.update({
      where: { id_tutor: id },
      data: { ativo: false },
    });
    // **Desativar todos os animais desse tutor**
  }

  // (Opcional) Delete real — somente para casos de manutenção/admin
  async hardDelete(id: number): Promise<tutor> {
    return prisma.tutor.delete({
      where: { id_tutor: id },
    });
  }

  // ?? Perguntar ao professor se precisa de um Reactivate
}

export default new TutorRepository();
