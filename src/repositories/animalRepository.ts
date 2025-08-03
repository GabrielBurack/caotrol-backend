import prisma from "../prisma";
import { animal, Prisma } from '@prisma/client';

class AnimalRepository {

  async create(data: Omit<animal, 'id_animal' | 'ativo'>): Promise<animal> {
    return prisma.animal.create({
      data: {
        ...data,
        ativo: true,
      },
      include: {
        tutor: true,
        raca: {
          include: {
            especie: true
          }
        }
      }
    });
  }

  async findAll(skip: number, take: number): Promise<animal[]> {
    return prisma.animal.findMany({
      where: { ativo: true },
      skip: skip,
      take: take,
      orderBy: {
        nome: 'asc'
      },
      include: {
        tutor: true,
        raca: {
          include: {
            especie: true
          }
        }
      }
    });
  }

  //contar o total de registros
  async countAll(): Promise<number> {
    return prisma.animal.count({
      where: { ativo: true }
    });
  }


  async findAllByTutorId(id_tutor: number): Promise<animal[]> {
    return prisma.animal.findMany({
      where: {
        id_tutor: id_tutor, // O filtro para buscar apenas animais deste tutor
        ativo: true        // Garante que só traga animais ativos
      }
    });
  }
  async findById(id: number): Promise<animal | null> {
    return prisma.animal.findUnique({
      where: { id_animal: id },
      include: {
        tutor: true,
        raca: {
          include: {
            especie: true
          }
        }
      }
    });
  }

  async update(id: number, data: Partial<animal>): Promise<animal> {
    return prisma.animal.update({
      where: { id_animal: id },
      data,
      include: {
        tutor: true,
        raca: {
          include: {
            especie: true
          }
        }
      }
    });
  }

  async deactivate(id: number): Promise<animal> {
    return prisma.animal.update({
      where: { id_animal: id },
      data: { ativo: false },
    });
  }
}

export default new AnimalRepository();