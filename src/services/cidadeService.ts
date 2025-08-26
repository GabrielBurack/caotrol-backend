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
    const estado = await estadoRepository.findById(id_estado);
    if (!estado) {
      throw new NotFoundError("O estado informado não existe.");
    }
    return cidadeRepository.findAllByEstado(id_estado);
  }

  async search(id_estado: number, busca: string): Promise<cidade[]> {
    const estado = await estadoRepository.findById(id_estado);
    if (!estado) {
      throw new NotFoundError("O estado informado не existe.");
    }
    if (!busca || busca.trim().length < 2) {
      return [];
    }
    return cidadeRepository.searchByName(id_estado, busca);
  }
}

export default new CidadeService();