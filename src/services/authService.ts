import userRepository from '../repositories/userRepository';
import veterinarioRepository from "../repositories/veterinarioRepository"; // 1. IMPORTAR O REPOSITÓRIO
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

        // 2. PREPARAR O CONTEÚDO DO TOKEN (PAYLOAD)
        const payload: { [key: string]: any } = {
            id: user.id_usuario,
            tipo: user.tipo,
            id_veterinario: user.id_veterinario
        };
        
        // 3. SE FOR UM VETERINÁRIO, BUSCAR E ADICIONAR O NOME
        if (user.id_veterinario) {
            const veterinario = await veterinarioRepository.findById(user.id_veterinario);
            if (veterinario) {
                payload.nome_veterinario = veterinario.nome;
            }
        }

        const token = jwt.sign(
            payload, // 4. USAR O NOVO PAYLOAD COM O NOME
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' } 
        );

        return token;
    }
}

export default new AuthService();