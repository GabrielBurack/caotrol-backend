import { exame, Prisma } from "@prisma/client";
import exameRepository from "../repositories/exameRepository";
import { NotFoundError } from "../helpers/ApiError";
import animalRepository from "../repositories/animalRepository";

class ExameService {

    async findAllByAnimal(id_animal: number) {
        const animal = await animalRepository.findById(id_animal);
        if (!animal) {
            throw new NotFoundError('Animal não encontrado.');
        }
        return exameRepository.findAllByAnimalId(id_animal);
    }

    async update(id_exame: number, data: Prisma.exameUpdateInput): Promise<exame> {
        const exameExiste = await exameRepository.findById(id_exame);
        if (!exameExiste) {
            throw new NotFoundError("Registro de exame não encontrado.");
        }
        return exameRepository.update(id_exame, data);
    }

    async delete(id_exame: number): Promise<exame> {
        const exameExiste = await exameRepository.findById(id_exame);
        if (!exameExiste) {
            throw new NotFoundError("Registro de exame não encontrado.");
        }
        return exameRepository.delete(id_exame);
    }
}

export default new ExameService();