import tutorRepository from "../repositories/tutorRepository";
import { tutor } from "@prisma/client";
import animalRepository from "../repositories/animalRepository";


class TutorService {

    async create(data: Omit<tutor, 'id_tutor' | 'ativo'>): Promise<tutor> {
        // Exemplo de regra de negócio: Poderíamos verificar duplicidade de CPF aqui
        return tutorRepository.create(data);
    }

    async findAll(page: number, limit: number) {
        // 1. Lógica para calcular quais registros buscar
        const skip = (page - 1) * limit;

        // 2. Busca os dados no repositório
        const [tutores, total] = await Promise.all([
            tutorRepository.findAll(skip, limit),
            tutorRepository.countAll()
        ]);

        // 3. Lógica para calcular o total de páginas
        const totalPages = Math.ceil(total / limit);
        const currentPage = page;
        
        return {
            data: tutores,    
            total,
            totalPages,
            currentPage,
        };
    }

    async findAnimaisDoTutor(id_tutor: number) {
        // Validação: verifica se o tutor existe antes de buscar os animais
        const tutorExiste = await tutorRepository.findById(id_tutor);
        if (!tutorExiste) {
            throw new Error("Tutor não encontrado.");
        }

        // Chama o repositório de ANIMAIS para buscar os animais daquele tutor
        return animalRepository.findAllByTutorId(id_tutor);
    }
    async findById(id: number): Promise<tutor | null> {
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