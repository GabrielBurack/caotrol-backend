import prisma from "../prisma";
import { veterinario } from "@prisma/client";

class VeterinarioRepository {
  async create(
    data: Omit<veterinario, "id_veterinario">
  ): Promise<veterinario> {
    return prisma.veterinario.create({ data });
  }

  async findAll(): Promise<veterinario[]> {
    return prisma.veterinario.findMany();
  }

  async findById(id: number): Promise<veterinario | null> {
    return prisma.veterinario.findUnique({
      where: { id_veterinario: id },
    });
  }

  async update(
    id: number,
    data: Partial<veterinario>
  ): Promise<veterinario | null> {
    return prisma.veterinario.update({
      where: { id_veterinario: id },
      data,
    });
  }

  async delete(id: number): Promise<veterinario> {
    return prisma.veterinario.delete({
      where: { id_veterinario: id },
    });
  }

  async findByCpfOrCrmv(cpf: string, crmv: string): Promise<veterinario | null> {
    return prisma.veterinario.findFirst({
        where: {
            OR: [
                { cpf: cpf },
                { crmv: crmv }
            ]
        }
    });
  }
}

export default new VeterinarioRepository();
