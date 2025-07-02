import especieRepository from '../repositories/especieRepository';

class EspecieService {
  async create(data: { nome: string }) {

    if (!data.nome || data.nome.trim() === '') {
      throw new Error('O nome da espécie é obrigatório.');
    }

    const nameExists = await especieRepository.findByName(data.nome);
    if(nameExists){
        throw new Error('Espécie já cadastrada.');
    }

    return especieRepository.create(data);
  }

  async findAll() {
    return especieRepository.findAll();
  }

  async findById(id: number) {
    return especieRepository.findById(id);
  }

  async update(id: number, data: { nome: string }) {
    return especieRepository.update(id, data);
  }

  async delete(id: number) {
    return especieRepository.delete(id);
  }
}

export default new EspecieService();