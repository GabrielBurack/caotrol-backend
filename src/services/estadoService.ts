import { estado, Prisma } from "@prisma/client";
import estadoRepository from "../repositories/estadoRepository";
import { BadRequestError } from "../helpers/ApiError";

class EstadoService {
  async create(data: Prisma.estadoCreateInput): Promise<estado> {
    const estadoExistente = await estadoRepository.findByUf(data.uf);
    if (estadoExistente) {
        throw new BadRequestError("Já existe um estado cadastrado com esta UF.");
    }
    return estadoRepository.create(data);
  }

  async findAll(): Promise<estado[]> {
    return estadoRepository.findAll();
  }
}

export default new EstadoService();