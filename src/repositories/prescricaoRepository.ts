import prisma from "../prisma";
import { prescricao, Prisma } from "@prisma/client";

class PrescricaoRepository {
  
  async findById(id_prescricao: number): Promise<prescricao | null> {
    return prisma.prescricao.findUnique({
      where: { id_prescricao },
    });
  }

  async findAllByAnimalId(id_animal: number): Promise<prescricao[]> {
    return prisma.prescricao.findMany({
      where: {
        consulta: { // Filtra as prescrições com base na consulta
          id_animal: id_animal, // à qual o animal pertence
        },
      },
      include: {
        consulta: { // Inclui dados da consulta para dar contexto (data, vet)
          select: {
            data: true,
            veterinario: { select: { nome: true } }
          }
        }
      },
      orderBy: {
        consulta: {
          data: 'desc' 
        }
      }
    });
  }

  async update(id_prescricao: number, data: Prisma.prescricaoUpdateInput): Promise<prescricao> {
    return prisma.prescricao.update({
      where: { id_prescricao },
      data,
    });
  }

  async delete(id_prescricao: number): Promise<prescricao> {
    return prisma.prescricao.delete({
      where: { id_prescricao },
    });
  }

  // Busca uma prescrição com todos os dados aninhados necessários para o PDF
  async findByIdComplet(id_prescricao: number) {
    return prisma.prescricao.findUnique({
      where: { id_prescricao },
      include: {
        consulta: {
          include: {
            veterinario: true,
            animal: {
              include: {
                tutor: true,
                raca: { include: { especie: true } }
              }
            }
          }
        }
      }
    });
  }
}

export default new PrescricaoRepository();