import { Request, Response } from "express";
import userService from "../services/userService";

class UserController {
    async register(req: Request, res: Response){
        try {
            const user = await userService.register(req.body);
            res.status(201).json(user);

        } catch (error) {
            // Adicionar verificação de erro para login já existente
            res.status(500).json({ message: 'Erro ao registrar usuário', error });
        }
    }
}

export default new UserController();
