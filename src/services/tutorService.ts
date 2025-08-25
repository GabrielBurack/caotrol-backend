import { tutor } from "@prisma/client";
import tutorRepository from "../repositories/tutorRepository";
import animalRepository from "../repositories/animalRepository";
import { NotFoundError, BadRequestError } from "../helpers/ApiError";

class TutorService {
  async create(data: Omit<tutor, "id_tutor" | "ativo">): Promise<tutor> {
    const tutorExistente = await tutorRepository.findByCpf(data.cpf);
    if (tutorExistente) {
      throw new BadRequestError("Um tutor com este CPF já está cadastrado.");
    }
    return tutorRepository.create(data);
  }

  async findAll(page: number, limit: number, busca?: string, ordenarPor?: string) {
    const skip = (page - 1) * limit;
    const [tutores, total] = await Promise.all([
      tutorRepository.findAll(skip, limit, busca, ordenarPor),
      tutorRepository.countAll(busca),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      data: tutores,
      total,
      totalPages,
      currentPage: page,
    };
  }

  async search(termo: string) {
    if (!termo || termo.trim().length < 2) {
      return [];
    }
    return tutorRepository.searchByNameOrCpf(termo);
  }

  async findById(id: number): Promise<tutor> {
    const tutor = await tutorRepository.findById(id);
    if (!tutor) {
      throw new NotFoundError("Tutor não encontrado.");
    }
    return tutor;
  }

  async findAnimaisDoTutor(id_tutor: number) {
    await this.findById(id_tutor);
    return animalRepository.findAllByTutorId(id_tutor);
  }

  async update(id: number, data: Partial<tutor>): Promise<tutor> {
    //Garante que o tutor existe antes de tentar atualizar
    await this.findById(id); 
    return tutorRepository.update(id, data);
  }

  async deactivate(id: number): Promise<tutor> {
    await this.findById(id);
    return tutorRepository.deactivate(id);
  }
}

export default new TutorService();