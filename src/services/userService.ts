import userRepository from "../repositories/userRepository";
import { usuario } from "@prisma/client";
import * as bcrypt from 'bcryptjs';


class UserService {
  
    async register(userData: Omit<usuario, 'id_usuario'>): Promise<Omit<usuario, 'senha'>>{

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
}

export default new UserService();