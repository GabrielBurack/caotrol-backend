import { animal } from "@prisma/client";
import animalRepository from "../repositories/animalRepository";
import tutorRepository from "../repositories/tutorRepository";
import racaRepository from "../repositories/racaRepository";

class AnimalService {
  async create(data: Omit<animal, "id_animal" | "ativo">): Promise<animal> {
    const tutorExiste = await tutorRepository.findById(data.id_tutor);
    if (!tutorExiste) {
      throw new Error("O tutor informado não existe");
    }

    const racaExiste = racaRepository.findById(data.id_raca);
    if (!racaExiste) {
      throw new Error("A raça informado não existe");
    }

    return animalRepository.create(data);
  }

  async findAll(): Promise<animal[]> {
    return animalRepository.findAll();
  }

  async findById(id: number): Promise<animal | null> {
    return animalRepository.findById(id);
  }

  async update(id: number, data: Partial<animal>): Promise<animal> {
    const animalExiste = await animalRepository.findById(id);
    if (!animalExiste) {
      throw new Error("Animal não encontrado para atualização.");
    }

    return animalRepository.update(id, data);
  }

  async deactivate(id: number): Promise<animal> {
    const animalExiste = await animalRepository.findById(id);
    if (!animalExiste) {
      throw new Error("Animal não encontrado para desativá-lo.");
    }

    return animalRepository.deactivate(id);
  }
}

export default new AnimalService();