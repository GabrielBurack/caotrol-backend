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
        consulta: { 
          id_animal: id_animal, 
        },
      },
      include: {
        consulta: { 
          select: {
            data: true,
            // ATUALIZADO: Incluindo crmv para poder gerar o PDF corretamente depois
            veterinario: { select: { nome: true, crmv: true } } 
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