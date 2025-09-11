import prisma from "../prisma";
import { Prisma, usuario } from "@prisma/client";

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
      where: { ativo: true },
      skip: skip,
      take: take,
      orderBy: {
        login: "asc",
      },
    });
  }

  async countAll(): Promise<number> {
    return prisma.usuario.count({
        where: { ativo: true }
      });
  }

  async findByEmail(email: string): Promise<usuario | null> {
    return prisma.usuario.findUnique({ where: { email } });
  }

  async findByResetToken(token: string): Promise<usuario | null> {
    return prisma.usuario.findFirst({
      where: {
        reset_token: token,
        reset_token_expires: { gt: new Date() } 
      }
    });
  }

  async update(id: number, data: Prisma.usuarioUpdateInput): Promise<usuario> {
    return prisma.usuario.update({
      where: { id_usuario: id },
      data,
    });
  }

  async deactivate(id: number): Promise<usuario> {
    return prisma.usuario.update({
      where: { id_usuario: id },
      data: { ativo: false },
    });
  }
}

export default new UserRepository();
