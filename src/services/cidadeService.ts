import { cidade, Prisma } from "@prisma/client";
import cidadeRepository from "../repositories/cidadeRepository";
import estadoRepository from "../repositories/estadoRepository";
import { NotFoundError } from "../helpers/ApiError";

class CidadeService {
  async create(data: Prisma.cidadeUncheckedCreateInput): Promise<cidade> {
    // Garante que o estado informado existe
    const estado = await estadoRepository.findById(data.id_estado);
    if (!estado) {
      throw new NotFoundError("O estado informado não existe.");
    }
    return cidadeRepository.create(data);
  }

  async findAllByEstado(id_estado: number): Promise<cidade[]> {
    // Garante que o estado informado existe antes de buscar as cidades
    const estado = await estadoRepository.findById(id_estado);
    if (!estado) {
        throw new NotFoundError("O estado informado não existe.");
    }
    return cidadeRepository.findAllByEstado(id_estado);
  }
}

export default new CidadeService();