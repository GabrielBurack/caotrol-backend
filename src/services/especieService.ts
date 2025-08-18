import especieRepository from '../repositories/especieRepository';
import { BadRequestError, NotFoundError } from '../helpers/ApiError';

class EspecieService {
  
  async create(data: { nome: string }) {
    if (!data.nome || data.nome.trim() === '') {
      throw new BadRequestError('O nome da espécie é obrigatório.');
    }

    const nameExists = await especieRepository.findByName(data.nome);
    if (nameExists) {
      throw new BadRequestError('Espécie já cadastrada.');
    }

    return especieRepository.create(data);
  }

  async findAll() {
    return especieRepository.findAll();
  }

  async findById(id: number) {
    const especie = await especieRepository.findById(id);
    if (!especie) {
      throw new NotFoundError('Espécie não encontrada.');
    }
    return especie;
  }

  async update(id: number, data: { nome: string }) {
    const especie = await especieRepository.findById(id);
    if (!especie) {
      throw new NotFoundError('Espécie não encontrada para atualizar.');
    }
    return especieRepository.update(id, data);
  }

  async delete(id: number) {
    const especie = await especieRepository.findById(id);
    if (!especie) {
      throw new NotFoundError('Espécie não encontrada para deletar.');
    }
    return especieRepository.delete(id);
  }
}

export default new EspecieService();
