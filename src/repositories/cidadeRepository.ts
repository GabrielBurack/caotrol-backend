import prisma from "../prisma";
import { cidade, Prisma } from "@prisma/client";

class CidadeRepository {
  async create(data: Prisma.cidadeUncheckedCreateInput): Promise<cidade> {
    return prisma.cidade.create({ data });
  }

  async findById(id_cidade: number): Promise<cidade | null> {
    return prisma.cidade.findUnique({
      where: { id_cidade },
    });
  }

  async findAllByEstado(id_estado: number): Promise<cidade[]> {
    return prisma.cidade.findMany({
      where: { id_estado },
      orderBy: { nome: 'asc' }
    });
  }

  async findByNomeAndEstado(nome: string, id_estado: number): Promise<cidade | null> {
  return prisma.cidade.findFirst({
    where: {
      nome: { equals: nome, mode: 'insensitive' }, // Busca exata, ignorando maiúsculas
      id_estado: id_estado,
    },
  });
}
}

export default new CidadeRepository();