import { Request, Response } from 'express';
import authService from '../services/authService';
import asyncHandler from 'express-async-handler';

class AuthController {
    
    login = asyncHandler(async (req: Request, res: Response) => {
        const { login, senha } = req.body;
        const token = await authService.login(login, senha);
        res.status(200).json({ token });
    });
}

export default new AuthController();