import veterinarioRepository from "../repositories/veterinarioRepository";
import { veterinario } from "@prisma/client";

class VeterinarioService {
  async create(
    data: Omit<veterinario, "id_veterinario">
  ): Promise<veterinario> {

    if (!data.nome || !data.cpf || !data.crmv) {
      throw new Error("Nome, CPF e CRMV são obrigatórios.");
    }
    const veterinarioExiste = await veterinarioRepository.findByCpfOrCrmv(
      data.cpf,
      data.crmv
    );
    if (veterinarioExiste) {
      if (veterinarioExiste.cpf === data.cpf) {
        throw new Error("Um veterinário com este CPF já está cadastrado.");
      }
      if (veterinarioExiste.crmv === data.crmv) {
        throw new Error("Um veterinário com este CRMV já está cadastrado.");
      }
    }

    return veterinarioRepository.create(data);
  }

  async findAll(): Promise<veterinario[]> {
    return veterinarioRepository.findAll();
  }

  async findById(id: number): Promise<veterinario | null> {
    return veterinarioRepository.findById(id);
  }

  async update(id: number, data: Partial<veterinario>): Promise<veterinario| null> {

    const veterinarioExiste = await veterinarioRepository.findById(id);
    if (!veterinarioExiste) {
      throw new Error('Veterinário não encontrado para atualização.');
    }

    return veterinarioRepository.update(id, data);
  }

  async delete(id: number): Promise<veterinario| null> {
    
    const veterinarioExiste = await veterinarioRepository.findById(id);
    if (!veterinarioExiste) {
      throw new Error('Veterinário não encontrado para exclusão.');
    }
    return veterinarioRepository.delete(id);
  }

}

export default new VeterinarioService();