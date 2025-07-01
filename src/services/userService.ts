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

    // async login(login: string, senhaInserida: string): Promise<string | null>{
    //     const user = await userRepository.findByLogin(login);

    //     if (!user) {
    //         throw new Error('Usuário não encontrado'); 
    //     }

    //     const senhaValida = await bcrypt.compare(senhaInserida, user.senha);
    //     if (!senhaValida) {
    //         throw new Error("Senha inválida");
    //     }

    //     const token = jwt.sign(
    //         { id: user.id_usuario, tipo: user.tipo }, // Payload
    //         process.env.JWT_SECRET as string, // Chave secreta para assinar o token
    //         { expiresIn: '8h' } 
    //     );
    // }
}

export default new UserService();