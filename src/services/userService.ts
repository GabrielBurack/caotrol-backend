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
    console.log("1. Iniciando registro de usuário:", userData.email);

    const emailExistente = await userRepository.findByEmail(userData.email);
    if (emailExistente) {
      throw new BadRequestError("Este e-mail já está em uso.");
    }

    // **GERA O HASH DA SENHA**
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.senha, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    // CRIA O USUÁRIO
    console.log("2. Criando usuário no banco de dados...");
    const novoUsuario = await userRepository.create({
      ...userData,
      senha: hashedPassword,
      email_verificado: false, 
      token_verificacao: verificationToken,
    });
    console.log("3. Usuário criado com ID:", novoUsuario.id_usuario);

    // TENTA ENVIAR O E-MAIL
    try {
        const verificationURL = `${process.env.FRONTEND_URL}/verificar-email/${verificationToken}`;
        
        console.log("4. Preparando envio de e-mail...");
        await sendEmail({
          to: novoUsuario.email,
          subject: "Verifique seu e-mail - Clínica Caotrol",
          html: `<p>Bem-vindo à Clínica Caotrol! Por favor, clique no link a seguir para verificar seu e-mail:</p><a href="${verificationURL}">${verificationURL}</a>`,
        });
        
        console.log("5. E-mail enviado com sucesso. Processo finalizado.");

    } catch (emailError) {
        console.error("!!! ERRO CRÍTICO NO ENVIO DE EMAIL !!!");
        console.error(emailError);

        // ROLLBACK: Apaga o usuário pois o e-mail falhou
        console.log("6. Executando ROLLBACK (Deletando usuário criado)...");
        await userRepository.delete(novoUsuario.id_usuario);
        console.log("7. Usuário deletado com sucesso.");

        throw new BadRequestError("Erro ao enviar e-mail de confirmação. Verifique se o e-mail existe. O cadastro foi cancelado.");
    }

    const { senha, ...userSemSenha } = novoUsuario;
    return userSemSenha as usuario;
  }

  // ... Mantenha o resto dos métodos (findAll, update, etc) iguais ...
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [usuarios, total] = await Promise.all([
      userRepository.findAll(skip, limit),
      userRepository.countAll(),
    ]);
    const usuariosSemSenha = usuarios.map((usuario) => {
      const { senha, ...user } = usuario;
      return user;
    });
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;
    return { data: usuariosSemSenha, total, totalPages, currentPage };
  }

  async findById(id: number): Promise<usuario> {
    if (isNaN(id)) throw new BadRequestError("O ID do usuário deve ser um número.");
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    return user;
  }

  async update(id: number, data: UserUpdateData, idUsuarioLogado: number): Promise<usuario> {
    const userToUpdate = await this.findById(id);
    if (id === idUsuarioLogado && data.tipo && data.tipo !== userToUpdate.tipo) {
      throw new BadRequestError("Você não pode alterar seu próprio tipo de usuário.");
    }
    const updateData: Prisma.usuarioUpdateInput = {
      login: data.login,
      email: data.email,
      tipo: data.tipo as any,
    };
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
    if (id === idUsuarioLogado) throw new BadRequestError("Você não pode desativar seu próprio usuário.");
    await this.findById(id);
    const userDesativado = await userRepository.deactivate(id);
    const { senha, ...userSemSenha } = userDesativado;
    return userSemSenha as usuario;
  }
}

export default new UserService();