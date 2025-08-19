// src/repositories/consultaRepository.ts

import prisma from "../prisma";
import { consulta, Prisma } from "@prisma/client";

class ConsultaRepository {
  async create(data: Prisma.consultaCreateInput): Promise<consulta> {
    return prisma.consulta.create({
      data,
      include: {
        prescricao: true,
        exame: true,
        anamnese: true,
      },
    });
  }

  async findById(id: number): Promise<consulta | null> {
    return prisma.consulta.findUnique({
      where: { id_consulta: id },
      include: {
        prescricao: true,
        exame: true,
        anamnese: true,
        veterinario: { select: { nome: true, crmv: true } },
        animal: {
          include: {
            tutor: true,
          },
        },
      },
    });
  }

  /**
   * Busca todas as consultas de um animal específico para montar o histórico clínico.
   */
  async findAllByAnimalId(id_animal: number): Promise<consulta[]> {
    return prisma.consulta.findMany({
      where: { id_animal },
      orderBy: {
        data: "desc",
      },
      include: {
        prescricao: true,
        exame: true,
        veterinario: { select: { nome: true } },
      },
    });
  }

  async findAll(
    skip: number,
    take: number,
    busca?: string,
    dataInicio?: Date,
    dataFim?: Date,
    ordenarPor?: string
  ): Promise<consulta[]> {
    const where: Prisma.consultaWhereInput = {};

    if (busca) {
      where.OR = [
        { animal: { nome: { contains: busca, mode: "insensitive" } } },
        {
          animal: { tutor: { nome: { contains: busca, mode: "insensitive" } } },
        },
        { animal: { tutor: { cpf: { contains: busca } } } },
      ];
    }

    if (dataInicio && dataFim) {
      where.data = {
        gte: dataInicio,
        lte: dataFim,
      };
    }

    let orderBy: Prisma.consultaOrderByWithRelationInput = { data: "desc" }; // Padrão
    if (ordenarPor === "data_asc") {
      orderBy = { data: "asc" };
    }

    return prisma.consulta.findMany({
      where,
      skip,
      take,
      orderBy,
      // --- CORREÇÃO APLICADA AQUI NO 'INCLUDE' ---
      include: {
        veterinario: { select: { nome: true } },
        // Para pegar o animal e o tutor, precisamos aninhar o include
        animal: {
          include: {
            tutor: {
              // Inclui os dados do tutor DENTRO do animal
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });
  }

  async countAll(
    busca?: string,
    dataInicio?: Date,
    dataFim?: Date
  ): Promise<number> {
    const where: Prisma.consultaWhereInput = {};

    if (busca) {
      where.OR = [
        { animal: { nome: { contains: busca, mode: "insensitive" } } },
        // --- E A MESMA CORREÇÃO AQUI ---
        {
          animal: { tutor: { nome: { contains: busca, mode: "insensitive" } } },
        },
        { animal: { tutor: { cpf: { contains: busca } } } },
      ];
    }

    if (dataInicio && dataFim) {
      where.data = {
        gte: dataInicio,
        lte: dataFim,
      };
    }

    return prisma.consulta.count({ where });
  }
}

export default new ConsultaRepository();
