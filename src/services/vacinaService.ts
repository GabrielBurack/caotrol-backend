import { vacina, Prisma } from '@prisma/client';
import vacinaRepository from '../repositories/vacinaRepository';
import animalRepository from '../repositories/animalRepository';

class VacinaService {
  /**
   * Valida e registra uma nova vacina para um animal.
   * @param id_animal - O ID do animal que receberá a vacina.
   * @param dadosVacina - Os dados da vacina (nome, data de aplicação, etc.).
   */
  async registrar(id_animal: number, dadosVacina: Omit<vacina, 'id_vacina' | 'id_animal'>): Promise<vacina> {
    const animal = await animalRepository.findById(id_animal);
    if (!animal) {
      throw new Error('Animal não encontrado. Não é possível registrar a vacina.');
    }

    // Validação de datas (exemplo: data de aplicação não pode ser no futuro)
    const dataAplicacao = new Date(dadosVacina.data_aplic);
    if (dataAplicacao > new Date()) {
      throw new Error('A data de aplicação da vacina não pode ser uma data futura.');
    }

    const dadosParaCriar: Prisma.vacinaUncheckedCreateInput = {
      ...dadosVacina,
      data_aplic: dataAplicacao, 
      id_animal: id_animal,
    };

    return vacinaRepository.create(dadosParaCriar);
  }

  /**
   * Busca o histórico de vacinas de um animal.
   * @param id_animal - O ID do animal.
   */
  async buscarPorAnimal(id_animal: number): Promise<vacina[]> {
    const animal = await animalRepository.findById(id_animal);
    if (!animal) {
      throw new Error('Animal não encontrado.');
    }
    return vacinaRepository.findAllByAnimalId(id_animal);
  }

  /**
   * Deleta um registro de vacina.
   * @param id_vacina - O ID do registro de vacina a ser deletado.
   */
  async deletar(id_vacina: number): Promise<vacina> {
    const vacina = await vacinaRepository.findById(id_vacina);
    if (!vacina) {
        throw new Error('Registro de vacina não encontrado.');
    }
    return vacinaRepository.delete(id_vacina);
  }
}

export default new VacinaService();