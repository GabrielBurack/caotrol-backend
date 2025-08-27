import userRepository from '../repositories/userRepository';
import veterinarioRepository from "../repositories/veterinarioRepository";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
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
        };
        
        if (user.id_veterinario) {
            payload.id_veterinario = user.id_veterinario;
            const veterinario = await veterinarioRepository.findById(user.id_veterinario);
            if (veterinario) {
                payload.nome_veterinario = veterinario.nome;
            }
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' } 
        );

        return token;
    }
}

export default new AuthService();