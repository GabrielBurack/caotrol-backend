import prisma from "../prisma";
import { estado, Prisma } from "@prisma/client";

class EstadoRepository {
  async create(data: Prisma.estadoCreateInput): Promise<estado> {
    return prisma.estado.create({ data });
  }

  async findAll(): Promise<estado[]> {
    return prisma.estado.findMany({
      orderBy: { nome: 'asc' }
    });
  }

  async findById(id_estado: number): Promise<estado | null> {
    return prisma.estado.findUnique({ where: { id_estado } });
  }

  async findByUf(uf: string): Promise<estado | null> {
    return prisma.estado.findUnique({ where: { uf } });
  }
}

export default new EstadoRepository();