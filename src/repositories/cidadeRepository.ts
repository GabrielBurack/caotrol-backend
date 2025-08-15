import prisma from "../prisma";
import { cidade, Prisma } from "@prisma/client";

class CidadeRepository {
  async create(data: Prisma.cidadeUncheckedCreateInput): Promise<cidade> {
    return prisma.cidade.create({ data });
  }

  async findAllByEstado(id_estado: number): Promise<cidade[]> {
    return prisma.cidade.findMany({
      where: { id_estado },
      orderBy: { nome: 'asc' }
    });
  }
}

export default new CidadeRepository();