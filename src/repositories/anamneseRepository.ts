import prisma from "../prisma";
import { anamnese, Prisma } from "@prisma/client";

class AnamneseRepository {
  async create(data: Prisma.anamneseUncheckedCreateInput): Promise<anamnese> {
    return prisma.anamnese.create({
      data,
    });
  }

  async findAllByAnimalId(id_animal: number): Promise<anamnese[]> {
    return prisma.anamnese.findMany({
      where: {
        consulta: {
          id_animal: id_animal,
        },
      },
      include: {
        consulta: {
          select: {
            queixa: true,
            data: true,
            veterinario: { select: { nome: true } },
          },
        },
      },
      orderBy: {
        id_anamnese: "desc", // Ordena da mais recente para a mais antiga
      },
    });
  }
}

export default new AnamneseRepository();
