import userRepository from "../repositories/userRepository";
import { usuario, Prisma } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import { BadRequestError, NotFoundError } from "../helpers/ApiError";

interface UserUpdateData {
  login?: string;
  email?: string;
  tipo?: string;
  senha?: string;
}

class UserService {

  async register(userData: Omit<usuario, 'id_usuario'>): Promise<Omit<usuario, 'senha'>> {

    // **GERA O HASH DA SENHA**
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.senha, salt);

    const newUser = {
      ...userData,
      senha: hashedPassword,
    };

    const createdUser = await userRepository.create(newUser);

    // Remove a senha do objeto antes de retorná-lo
    const { senha, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [usuarios, total] = await Promise.all([
      userRepository.findAll(skip, limit),
      userRepository.countAll()
    ]);

    // Mapeia os resultados para remover a senha de cada usuário
    const usuariosSemSenha = usuarios.map(usuario => {
      const { senha, ...user } = usuario;
      return user;
    });

    const totalPages = Math.ceil(total / limit);
    const currentPage = page;

    return {
      data: usuariosSemSenha, // Retorna a lista sem as senhas
      total,
      totalPages,
      currentPage,
    };
  }

  async findById(id: number): Promise<usuario> {
    if (isNaN(id)) throw new BadRequestError("O ID do usuário deve ser um número.");
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    return user;
  }

  async update(id: number, data: UserUpdateData, idUsuarioLogado: number): Promise<usuario> {

    const userToUpdate = await this.findById(id);

    // Regra de negócio: Impede que um usuário altere o seu próprio tipo (role)
    if (id === idUsuarioLogado && data.tipo && data.tipo !== userToUpdate.tipo) {
      throw new BadRequestError("Você não pode alterar seu próprio tipo de usuário.");
    }

    const updateData: Prisma.usuarioUpdateInput = {
      login: data.login,
      email: data.email,
      tipo: data.tipo as any, // Cast para o tipo enum
    };

    // Regra de negócio: Se uma nova senha for fornecida, criptografa antes de salvar
    if (data.senha) {
      if (data.senha.length < 6) throw new BadRequestError("A senha deve ter no mínimo 6 caracteres.");
      const salt = await bcrypt.genSalt(10);
      updateData.senha = await bcrypt.hash(data.senha, salt);
    }

    const userAtualizado = await userRepository.update(id, updateData);

    const { senha, ...userSemSenha } = userAtualizado;
    return userSemSenha as usuario;
  }

  async deactivate(id: number, idUsuarioLogado: number): Promise<usuario> {
    if (id === idUsuarioLogado) {
      throw new BadRequestError("Você não pode desativar seu próprio usuário.");
    }

    await this.findById(id);

    const userDesativado = await userRepository.deactivate(id);
    const { senha, ...userSemSenha } = userDesativado;

    return userSemSenha as usuario;
  }
}

export default new UserService();