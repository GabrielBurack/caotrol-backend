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
}

export default new UserService();