import prisma from "../prisma";
import { usuario } from "@prisma/client";

class UserRepository { 
    async create(data: Omit<usuario, 'id_usuario'>): Promise<usuario>{
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
}

export default new UserRepository();