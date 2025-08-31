import prisma from "../prisma";
import { exame, Prisma } from "@prisma/client";

class ExameRepository {
  
  async findById(id_exame: number): Promise<exame | null> {
    return prisma.exame.findUnique({
      where: { id_exame },
    });
  }

  async findAllByAnimalId(id_animal: number): Promise<exame[]> {
    return prisma.exame.findMany({
      where: {
        consulta: { // Filtra os exames com base na consulta
          id_animal: id_animal, // à qual o animal pertence
        },
      },
      include: {
        consulta: { // Inclui dados da consulta para dar contexto (data, vet)
          select: {
            data: true,
            veterinario: { select: { nome: true } }
          }
        }
      },
      orderBy: {
        consulta: {
          data: 'desc' 
        }
      }
    });
  }

  async update(id_exame: number, data: Prisma.exameUpdateInput): Promise<exame> {
    return prisma.exame.update({
      where: { id_exame },
      data,
    });
  }

  async delete(id_exame: number): Promise<exame> {
    return prisma.exame.delete({
      where: { id_exame },
    });
  }

  // Busca um exame com todos os dados aninhados necessários para o PDF
  async findByIdComplet(id_exame: number) {
    return prisma.exame.findUnique({
      where: { id_exame },
      include: {
        consulta: {
          include: {
            veterinario: true,
            animal: {
              include: {
                tutor: true,
                raca: { include: { especie: true } }
              }
            }
          }
        }
      }
    });
  }
}

export default new ExameRepository();