import { Request, Response } from "express";
import userService from "../services/userService";
import AsyncHandler from "express-async-handler";

class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      // Adicionar verificação de erro para login já existente
      res.status(500).json({ message: "Erro ao registrar usuário", error });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const resultadoPaginado = await userService.findAll(page, limit);

      res.status(200).json(resultadoPaginado);
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar usuário", error });
    }
  }

  update = AsyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const idUsuarioLogado = req.usuario!.id; // Pega o ID do admin logado

    const usuarioAtualizado = await userService.update(id, req.body, idUsuarioLogado);
    res.status(200).json(usuarioAtualizado);
  });
}

export default new UserController();
