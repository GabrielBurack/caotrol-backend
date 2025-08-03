// src/controllers/authController.ts

import { Request, Response } from 'express';
import authService from '../services/authService';

class AuthController {
    /**
     * Realiza o login de um usuário (veterinário ou cliente) e retorna um token JWT.
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { login, senha } = req.body;

            if (!login || !senha) {
                res.status(400).json({ message: 'Os campos "login" e "senha" são obrigatórios.' });
                return;
            }

            const token = await authService.login(login, senha);

            if (!token) {
                // Correção: ajustado o 'return'
                res.status(401).json({ message: 'Login ou senha inválidos' });
                return;
            }

            res.status(200).json({ token });
        } catch (error: any) {
            // Loga o erro detalhado no servidor para depuração
            console.error('Erro no login:', error);

            // Envia uma mensagem genérica para o cliente
            res.status(500).json({ message: 'Ocorreu um erro interno ao processar sua solicitação.' });
        }
    }
}

export default new AuthController();