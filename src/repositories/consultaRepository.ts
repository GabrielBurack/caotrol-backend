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
        anamnese: true
      }
    });
  }

  async findById(id: number): Promise<consulta | null> {
    return prisma.consulta.findUnique({
      where: { id_consulta: id },
       include: {
        prescricao: true,
        exame: true,
        anamnese: true,
        veterinario: { select: { nome: true, crmv: true } }
      }
    });
  }

  /**
   * Busca todas as consultas de um animal específico para montar o histórico clínico.
   */
  async findAllByAnimalId(id_animal: number): Promise<consulta[]> {
    return prisma.consulta.findMany({
      where: { id_animal },
      orderBy: {
        data: 'desc' 
      },
      include: {
        prescricao: true,
        exame: true,
        veterinario: { select: { nome: true } }
      }
    });
  }
}

export default new ConsultaRepository();