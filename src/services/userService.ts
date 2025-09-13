import userRepository from "../repositories/userRepository";
import { usuario, Prisma } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { BadRequestError, NotFoundError } from "../helpers/ApiError";
import { sendEmail } from "../helpers/emailHelpers";
import crypto from "crypto";

interface UserUpdateData {
  login?: string;
  email?: string;
  tipo?: string;
  senha?: string;
}

class UserService {
  async register(
    userData: Omit<usuario, "id_usuario">
  ): Promise<Omit<usuario, "senha">> {
    const emailExistente = await userRepository.findByEmail(userData.email);
    if (emailExistente) {
      throw new BadRequestError("Este e-mail já está em uso.");
    }

    // **GERA O HASH DA SENHA**
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.senha, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const novoUsuario = await userRepository.create({
      ...userData,
      senha: hashedPassword,
      email_verificado: false, // O usuário começa como não verificado
      token_verificacao: verificationToken,
    });

    // Envia o e-mail de verificação
    const verificationURL = `${process.env.FRONTEND_URL}/verificar-email/${verificationToken}`;
    await sendEmail({
      to: novoUsuario.email,
      subject: "Verifique seu e-mail - Clínica Caotrol",
      html: `<p>Bem-vindo à Clínica Caotrol! Por favor, clique no link a seguir para verificar seu e-mail:</p><a href="${verificationURL}">${verificationURL}</a>`,
    });

    const { senha, ...userSemSenha } = novoUsuario;
    return userSemSenha as usuario;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [usuarios, total] = await Promise.all([
      userRepository.findAll(skip, limit),
      userRepository.countAll(),
    ]);

    // Mapeia os resultados para remover a senha de cada usuário
    const usuariosSemSenha = usuarios.map((usuario) => {
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
    if (isNaN(id))
      throw new BadRequestError("O ID do usuário deve ser um número.");
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    return user;
  }

  async update(
    id: number,
    data: UserUpdateData,
    idUsuarioLogado: number
  ): Promise<usuario> {
    const userToUpdate = await this.findById(id);

    // Regra de negócio: Impede que um usuário altere o seu próprio tipo (role)
    if (
      id === idUsuarioLogado &&
      data.tipo &&
      data.tipo !== userToUpdate.tipo
    ) {
      throw new BadRequestError(
        "Você não pode alterar seu próprio tipo de usuário."
      );
    }

    const updateData: Prisma.usuarioUpdateInput = {
      login: data.login,
      email: data.email,
      tipo: data.tipo as any, // Cast para o tipo enum
    };

    // Regra de negócio: Se uma nova senha for fornecida, criptografa antes de salvar
    if (data.senha) {
      if (data.senha.length < 6)
        throw new BadRequestError("A senha deve ter no mínimo 6 caracteres.");
      const salt = await bcrypt.genSalt(10);
      updateData.senha = await bcrypt.hash(data.senha, salt);
    }

    const userAtualizado = await userRepository.update(id, updateData);

    const { senha, ...userSemSenha } = userAtualizado;
    return userSemSenha as usuario;
  }

  async deactivate(id: number, idUsuarioLogado: number): Promise<usuario> {
    console.log("2. Serviço: Iniciando processo de desativação.");
    if (id === idUsuarioLogado) {
      throw new BadRequestError("Você não pode desativar seu próprio usuário.");
    }
    console.log("Serviço: Verificando se o usuário a ser desativado existe...");
    await this.findById(id);
    console.log('Serviço: Usuário encontrado. Enviando comando para o repositório.');

    const userDesativado = await userRepository.deactivate(id);
    console.log('3. Serviço: Repositório desativou o usuário.');

    const { senha, ...userSemSenha } = userDesativado;

    return userSemSenha as usuario;
  }
}

export default new UserService();
