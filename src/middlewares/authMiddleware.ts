// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendendo a interface Request do Express para adicionar a propriedade 'usuario'
interface DecodedToken {
  id: number;
  tipo: string;
}

declare global {
  namespace Express {
    export interface Request {
      usuario?: DecodedToken;
    }
  }
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as DecodedToken;
    
    req.usuario = decoded; // Adiciona os dados do usuário (id, tipo) na requisição
    
    return next(); // Passa para a próxima função (o controller)
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}