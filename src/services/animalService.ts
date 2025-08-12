import { animal } from "@prisma/client";
import animalRepository from "../repositories/animalRepository";
import tutorRepository from "../repositories/tutorRepository";
import racaRepository from "../repositories/racaRepository";
import { NotFoundError, BadRequestError } from "../helpers/ApiError";

class AnimalService {
  async create(data: Omit<animal, "id_animal" | "ativo">): Promise<animal> {

    const tutorExiste = await tutorRepository.findById(data.id_tutor);
    if (!tutorExiste) {
      throw new BadRequestError("O tutor informado não existe.");
    }

    const racaExiste = racaRepository.findById(data.id_raca);
    if (!racaExiste) {
      throw new BadRequestError("A raça informada não existe.");
    }

    return animalRepository.create(data);
  }

  async findAll(page: number, limit: number, busca?: string) {

    const skip = (page - 1) * limit;
    const [animais, total] = await Promise.all([
      animalRepository.findAll(skip, limit, busca),
      animalRepository.countAll(busca)
    ]);
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;

    return {
      data: animais,
      total,
      totalPages,
      currentPage,
    };
  }

  async findById(id: number): Promise<animal | null> {
    const animal = await animalRepository.findById(id);
    if (!animal) {
      throw new NotFoundError("Animal não encontrado.");
    }
    return animal;
  }

  async findAllByTutor(id_tutor: number) {
    const tutorExiste = await tutorRepository.findById(id_tutor);
    if (!tutorExiste) {
      throw new NotFoundError("Tutor não encontrado.");
    }
    return animalRepository.findAllByTutorId(id_tutor);
  }

  async update(id: number, data: Partial<animal>): Promise<animal> {
    await this.findById(id);
    return animalRepository.update(id, data);
  }

  async deactivate(id: number): Promise<animal> {
    await this.findById(id);
    return animalRepository.deactivate(id);
  }
}

export default new AnimalService();