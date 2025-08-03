import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface para o payload decodificado do token JWT.
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

/**
 * Middleware de autenticação que valida um token JWT.
 * - Verifica se o cabeçalho 'Authorization' existe e está no formato 'Bearer <token>'.
 * - Valida o token usando a chave secreta (JWT_SECRET).
 * - Em caso de sucesso, anexa os dados do usuário (`DecodedToken`) ao objeto `req`.
 * - Em caso de falha, envia uma resposta de erro 401.
 * @returns {void}
 */
export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { authorization } = req.headers;

  // 1. Verifica se o cabeçalho de autorização foi enviado
  if (!authorization) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return; // Encerra a execução
  }

  const parts = authorization.split(' ');

  // 2. Verifica se o formato é "Bearer [token]"
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ message: 'Token mal formatado.' });
    return; // Encerra a execução
  }

  const token = parts[1];
  
  try {
    const secret = process.env.JWT_SECRET;

    // Dica de segurança: verificar se a variável de ambiente existe
    if (!secret) {
        console.error('JWT_SECRET não foi definido nas variáveis de ambiente.');
        res.status(500).json({ message: 'Erro interno do servidor.' });
        return;
    }

    // 3. Verifica a validade do token
    const decoded = jwt.verify(token, secret) as DecodedToken;
    
    // 4. Anexa os dados do usuário à requisição para uso posterior
    req.usuario = decoded;
    
    // 5. Passa para o próximo middleware ou controller
    next();
  } catch (error) {
    // Captura erros de `jwt.verify` (token inválido, expirado, etc.)
    res.status(401).json({ message: 'Token inválido ou expirado.' });
    return; // Encerra a execução
  }
}