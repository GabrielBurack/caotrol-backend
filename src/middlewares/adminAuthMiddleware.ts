import { Request, Response, NextFunction } from 'express';
import { tipo_usuario_enum } from '@prisma/client';

/**
 * Middleware de Autorização de Administrador.
 *
 * Este middleware verifica se o usuário autenticado na requisição tem o tipo 'admin'.
 * Ele deve ser usado *depois* do `authMiddleware`, pois depende de `req.usuario` para existir.
 *
 * - Se o usuário não for um administrador, retorna uma resposta 403 (Proibido).
 * - Se o usuário for um administrador, passa o controle para a próxima função.
 * * @param req O objeto de requisição do Express, que deve conter `req.usuario`.
 * @param res O objeto de resposta do Express.
 * @param next A função para chamar o próximo middleware.
 * @returns {void}
 */
export default function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  // A '!' (Non-null assertion) assume que `req.usuario` existe.
  // Isso é seguro porque este middleware só deve ser usado após o authMiddleware.
  const { tipo } = req.usuario!;

  // Verifica se o tipo do usuário não é 'admin'
  if (tipo !== tipo_usuario_enum.admin) {
    // Retorna um erro 403 Forbidden (Acesso Proibido)
    res.status(403).json({ message: 'Acesso negado. Apenas administradores podem executar esta ação.' });
    
    // Encerra a execução da função aqui
    return;
  }

  // Se o usuário for um admin, permite que a requisição continue
  next();
}