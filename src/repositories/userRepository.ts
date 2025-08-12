import prisma from "../prisma";
import { usuario } from "@prisma/client";

class UserRepository {
  async create(data: Omit<usuario, "id_usuario">): Promise<usuario> {
    return prisma.usuario.create({ data });
  }

  async findByLogin(login: string): Promise<usuario | null> {
    return prisma.usuario.findUnique({ where: { login } });
  }

  async findById(id: number): Promise<usuario | null> {
    return prisma.usuario.findUnique({
      where: { id_usuario: id },
    });
  }

  async findAll(skip: number, take: number): Promise<usuario[]> {
    return prisma.usuario.findMany({
      skip: skip,
      take: take,
      orderBy: {
        login: "asc",
      },
    });
  }

  async countAll(): Promise<number> {
    return prisma.usuario.count();
  }
}

export default new UserRepository();
