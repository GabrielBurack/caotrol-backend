import userRepository from '../repositories/userRepository';
import veterinarioRepository from "../repositories/veterinarioRepository";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { sendEmail } from '../helpers/emailHelpers';
import crypto from 'crypto';
import { BadRequestError, UnauthorizedError } from '../helpers/ApiError';

class AuthService {

    async login(login?: string, senha?: string): Promise<string> {
        if (!login || !senha) {
            throw new BadRequestError('Os campos "login" e "senha" são obrigatórios.');
        }

        const user = await userRepository.findByLogin(login);
        const senhaValida = user ? await bcrypt.compare(senha, user.senha) : false;

        if (!user || !senhaValida) {
            throw new UnauthorizedError('Login ou senha inválidos.');
        }

        const payload: { [key: string]: any } = {
            id: user.id_usuario,
            tipo: user.tipo,
            nome_exibicao: user.login
        };

        if (user.id_veterinario) {
            payload.id_veterinario = user.id_veterinario;
            const veterinario = await veterinarioRepository.findById(user.id_veterinario);
            if (veterinario?.nome) {
                payload.nome_exibicao = veterinario.nome;
            }
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' }
        );

        return token;
    }

    async forgotPassword(email: string) {
    if (!email) throw new BadRequestError("O campo 'email' é obrigatório.");

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return; 
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos de validade

    await userRepository.update(user.id_usuario, {
      reset_token: passwordResetToken,
      reset_token_expires: passwordResetExpires
    });

    const resetURL = `http://localhost:3001/resetar-senha/${resetToken}`; // URL do frontend

    try {
        await sendEmail({
            to: user.email,
            subject: 'Redefinição de Senha - Clínica Lauro Vet',
            html: `<p>Você solicitou uma redefinição de senha. Por favor, clique no link a seguir para criar uma nova senha:</p><a href="${resetURL}">${resetURL}</a><p>Este link é válido por 10 minutos.</p>`
        });
    } catch (error) {
        console.error("Erro ao enviar e-mail de reset:", error);
        await userRepository.update(user.id_usuario, { reset_token: null, reset_token_expires: null });
        throw new Error('Não foi possível enviar o e-mail de redefinição de senha.');
    }
  }

  async resetPassword(token: string, novaSenha: string) {
    if (!token || !novaSenha) throw new BadRequestError("O token e a nova senha são obrigatórios.");

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new UnauthorizedError("Token inválido ou expirado.");
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);
    
    await userRepository.update(user.id_usuario, {
        senha: senhaHash,
        reset_token: null,
        reset_token_expires: null
    });
  }
}

export default new AuthService();