import { prescricao, Prisma } from "@prisma/client";
import prescricaoRepository from "../repositories/prescricaoRepository";
import { NotFoundError } from "../helpers/ApiError";
import animalRepository from "../repositories/animalRepository";

class PrescricaoService {

    async findAllByAnimal(id_animal: number) {
        const animal = await animalRepository.findById(id_animal);
        if (!animal) {
            throw new NotFoundError('Animal não encontrado.');
        }
        return prescricaoRepository.findAllByAnimalId(id_animal);
    }

    async update(id_prescricao: number, data: Prisma.prescricaoUpdateInput): Promise<prescricao> {
        const prescricaoExiste = await prescricaoRepository.findById(id_prescricao);
        if (!prescricaoExiste) {
            throw new NotFoundError("Registro de prescricao não encontrado.");
        }
        return prescricaoRepository.update(id_prescricao, data);
    }

    async delete(id_prescricao: number): Promise<prescricao> {
        const prescricaoExiste = await prescricaoRepository.findById(id_prescricao);
        if (!prescricaoExiste) {
            throw new NotFoundError("Registro de prescricao não encontrado.");
        }
        return prescricaoRepository.delete(id_prescricao);
    }
}

export default new PrescricaoService();