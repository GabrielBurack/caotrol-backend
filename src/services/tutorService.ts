import tutorRepository from "../repositories/tutorRepository";
import { tutor } from "@prisma/client";

class TutorService {

    async create(data: Omit<tutor, 'id_tutor' | 'ativo'>): Promise<tutor> {
        // Exemplo de regra de negócio: Poderíamos verificar duplicidade de CPF aqui
        return tutorRepository.create(data);
    }

    async findAll(): Promise<tutor[]> {
        return tutorRepository.findAll();
    }

    async findById(id: number): Promise<tutor | null>{
        return tutorRepository.findById(id);
    }

    async update(id: number, data: Partial<tutor>): Promise<tutor> {
        // Regra de negócio: Poderíamos verificar se o tutor existe antes de tentar atualizar
        return tutorRepository.update(id, data);
    }

    async deactivate(id: number): Promise<tutor> {
        // Regra de negócio: Poderíamos verificar se o tutor a ser deletado não tem animais associados
        return tutorRepository.deactivate(id);
    }
}

export default new TutorService();