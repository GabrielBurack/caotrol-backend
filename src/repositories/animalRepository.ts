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

  async findAll(skip: number, take: number, busca?: string): Promise<animal[]> {
    const where: Prisma.animalWhereInput = {
      ativo: true,
    };

    if (busca) {
      where.nome = {
        contains: busca,
        mode: 'insensitive',
      };
    }
    
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
 async countAll(busca?: string): Promise<number> {
    const where: Prisma.animalWhereInput = {
      ativo: true,
    };

    if (busca) {
      where.nome = {
        contains: busca,
        mode: 'insensitive',
      };
    }

    return prisma.animal.count({
      where: where,
    });
  }

  async findAllByTutorId(id_tutor: number): Promise<animal[]> {
    return prisma.animal.findMany({
      where: {
        id_tutor: id_tutor, 
        ativo: true 
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