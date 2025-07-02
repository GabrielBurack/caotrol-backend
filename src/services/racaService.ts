import { raca } from '@prisma/client';
import racaRepository from '../repositories/racaRepository';
import especieRepository from '../repositories/especieRepository';

class RacaService {

    async create(data: Omit<raca, 'id_raca'>): Promise<raca> {
        if (!data.nome || data.nome.trim() === '') {
            throw new Error('O nome da raça é obrigatório.');
        }
        if (!data.id_especie) {
            throw new Error('A espécie é obrigatória.');
        }

        const especieExiste = await especieRepository.findById(data.id_especie);
        if (!especieExiste) {
            throw new Error('A espécie informada não existe.');
        }

        return racaRepository.create(data);
    }

    async findAll(): Promise<raca[]> {
        return racaRepository.findAll();
    }

    async findById(id: number): Promise<raca | null> {
        return racaRepository.findById(id);
    }

    async update(id: number, data: Partial<raca>): Promise<raca> {
        const racaExiste = await racaRepository.findById(id);
        if (!racaExiste) {
            throw new Error('Raça não encontrada para atualização.');
        }

        if (data.id_especie) {
            const especieExiste = await especieRepository.findById(data.id_especie);
            if (!especieExiste) {
                throw new Error('A nova espécie informada para atualização não existe.');
            }
        }

        return racaRepository.update(id, data);
    }

    async delete(id: number): Promise<raca> {
        const racaExiste = await racaRepository.findById(id);
        if (!racaExiste) {
            throw new Error('Raça não encontrada para exclusão.');
        }

        return racaRepository.delete(id);
    }
}

export default new RacaService();