import { Request, Response } from 'express';
import authService from '../services/authService';

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { login, senha } = req.body;
            const token = await authService.login(login, senha);

            if (!token) {
                return res.status(401).json({ message: 'Login ou senha inválidos' });
            }
            
            res.status(200).json({ token });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno ao fazer login', erro: error.message });
        }
    }
}

export default new AuthController();