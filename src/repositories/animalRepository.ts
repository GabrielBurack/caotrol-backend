import prisma from "../prisma";
import { animal } from '@prisma/client';

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

  async findAll(): Promise<animal[]> {
    return prisma.animal.findMany({
      where: { ativo: true },
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