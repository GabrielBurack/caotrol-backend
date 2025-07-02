import prisma from "../prisma";
import { raca } from "@prisma/client";

class RacaRepository {

  async create(data: Omit<raca, 'id_raca'>): Promise<raca> {
    return prisma.raca.create({
      data,
      include: { especie: true },
    });
  }

  async findAll(): Promise<raca[]> {
    return prisma.raca.findMany({
      include: { especie: true },
    });
  }

  async findById(id: number): Promise<raca | null> {
    return prisma.raca.findUnique({
      where: { id_raca: id },
      include: { especie: true },
    });
  }

  async update(id: number, data: Partial<raca>): Promise<raca> {
    return prisma.raca.update({
      where: { id_raca: id },
      data,
      include: { especie: true },
    });
  }

  async delete(id: number): Promise<raca> {
    return prisma.raca.delete({
      where: { id_raca: id },
    });
  }
}

export default new RacaRepository();