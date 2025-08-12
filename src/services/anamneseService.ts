import anamneseRepository from "../repositories/anamneseRepository";
import animalRepository from "../repositories/animalRepository";
import consultaRepository from "../repositories/consultaRepository";

interface DadosAnamnese {
  castrado?: boolean;
  alergias?: string;
  obs?: string;
}

class AnamneseService {
  async registrar(id_consulta: number, dadosAnamnese: DadosAnamnese) {
    const consulta = await consultaRepository.findById(id_consulta);
    if (!consulta) {
      throw new Error(
        "Consulta não encontrada. Não é possível registrar a anamnese."
      );
    }

    const dadosParaCriar = {
      ...dadosAnamnese,
      id_consulta: id_consulta, // Adiciona o ID da consulta para o vínculo
    };

    return anamneseRepository.create(dadosParaCriar);
  }

  async buscarHistoricoPorAnimal(id_animal: number){
    const animal = animalRepository.findById(id_animal);

    if(!animal){
      throw new Error('Animal não encontrado.');
    }

    return anamneseRepository.findAllByAnimalId(id_animal);
  }
}

export default new AnamneseService();
