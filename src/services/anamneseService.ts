import anamneseRepository from "../repositories/anamneseRepository";
import animalRepository from "../repositories/animalRepository";
import consultaRepository from "../repositories/consultaRepository";
import { NotFoundError, BadRequestError } from "../helpers/ApiError";
import { anamnese, Prisma } from "@prisma/client";

interface DadosAnamnese {
  castrado?: boolean;
  alergias?: string;
  obs?: string;
}

class AnamneseService {
  async registrar(id_consulta: number, dadosAnamnese: DadosAnamnese): Promise<anamnese> {
    // Valida o ID da consulta
    if (isNaN(id_consulta)) {
      throw new BadRequestError("O ID da consulta deve ser um número.");
    }

    const consulta = await consultaRepository.findById(id_consulta);
    if (!consulta) {
      throw new NotFoundError(
        "Consulta não encontrada. Não é possível registrar a anamnese."
      );
    }

    const dadosParaCriar = {
      ...dadosAnamnese,
      id_consulta: id_consulta,
    };

    return anamneseRepository.create(dadosParaCriar as Prisma.anamneseUncheckedCreateInput);
  }

  async buscarHistoricoPorAnimal(id_animal: number): Promise<anamnese[]> {
    // Valida o ID do animal
    if (isNaN(id_animal)) {
        throw new BadRequestError("O ID do animal deve ser um número.");
    }
    
    // CORREÇÃO: Faltava um 'await' aqui
    const animal = await animalRepository.findById(id_animal);

    if (!animal) {
      throw new NotFoundError('Animal não encontrado.');
    }

    return anamneseRepository.findAllByAnimalId(id_animal);
  }
}

export default new AnamneseService();