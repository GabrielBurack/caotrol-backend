import prisma from "../prisma";
import { Prisma, usuario } from "@prisma/client";

class UserRepository {
  async create(data: Omit<usuario, "id_usuario">): Promise<usuario> {
    return prisma.usuario.create({ data });
  }

  async findByLogin(login: string): Promise<usuario | null> {
    return prisma.usuario.findFirst({
      where: {
        login: login,
        ativo: true, 
      },
    });
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
      where: { ativo: true },
    });
  }

  async findByEmail(email: string): Promise<usuario | null> {
    return prisma.usuario.findUnique({ where: { email } });
  }

  async findByResetToken(token: string): Promise<usuario | null> {
    return prisma.usuario.findFirst({
      where: {
        reset_token: token,
        reset_token_expires: { gt: new Date() },
      },
    });
  }

  async update(id: number, data: Prisma.usuarioUpdateInput): Promise<usuario> {
    return prisma.usuario.update({
      where: { id_usuario: id },
      data,
    });
  }

  async deactivate(id: number): Promise<usuario> {
    const timestamp = new Date().getTime(); 
    
    // Busca o usuário para pegar os dados atuais antes de anonimizar
    const user = await prisma.usuario.findUnique({ where: { id_usuario: id } });
    if (!user) {
        throw new Error('Usuário não encontrado para desativação'); 
    }

    return prisma.usuario.update({
      where: { id_usuario: id },
      data: { 
        ativo: false,
        login: `${user.login}_deactivated_${timestamp}`,
        email: `${user.email}_deactivated_${timestamp}`,
        reset_token: null,
        reset_token_expires: null
      },
    });
  }
  async findByVerificationToken(token: string): Promise<usuario | null> {
    return prisma.usuario.findFirst({
      where: {
        token_verificacao: token,
      },
    });
  }
}

export default new UserRepository();
