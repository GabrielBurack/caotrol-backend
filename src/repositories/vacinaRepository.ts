import prisma from "../prisma";
import { vacina, Prisma } from "@prisma/client";

class VacinaRepository {
  /**
   * Registra uma nova aplicação de vacina para um animal.
   * @param data - Dados da vacina a ser criada.
   */
  async create(data: Prisma.vacinaUncheckedCreateInput): Promise<vacina> {
    return prisma.vacina.create({
      data,
    });
  }

  /**
   * Busca todas as vacinas de um animal específico para exibir o histórico.
   * @param id_animal - O ID do animal.
   */
  async findAllByAnimalId(id_animal: number): Promise<vacina[]> {
    return prisma.vacina.findMany({
      where: { id_animal },
      orderBy: {
        data_aplic: 'desc', // Ordena da mais recente para a mais antiga
      },
    });
  }

  /**
   * Busca uma vacina específica pelo seu ID.
   * @param id_vacina - O ID da vacina.
   */
  async findById(id_vacina: number): Promise<vacina | null> {
    return prisma.vacina.findUnique({
      where: { id_vacina },
    });
  }

  /**
   * Deleta um registro de vacina.
   * @param id_vacina - O ID do registro de vacina a ser deletado.
   */
  async delete(id_vacina: number): Promise<vacina> {
    return prisma.vacina.delete({
      where: { id_vacina },
    });
  }
}

export default new VacinaRepository();