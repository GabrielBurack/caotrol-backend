import userRepository from '../repositories/userRepository';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthService {
    async login(login: string, senhaInserida: string): Promise<string | null>{
        const user = await userRepository.findByLogin(login);

        if (!user) {
            throw new Error('Usuário não encontrado'); 
        }

        const senhaValida = await bcrypt.compare(senhaInserida, user.senha);
        if (!senhaValida) {
            throw new Error("Senha inválida");
        }

        const token = jwt.sign(
            { id: user.id_usuario, tipo: user.tipo }, // Payload
            process.env.JWT_SECRET as string, // Chave secreta para assinar o token
            { expiresIn: '8h' } 
        );

        return token;
    }
}

export default new AuthService();