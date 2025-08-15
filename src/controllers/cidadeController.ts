import { Request, Response } from 'express';
import cidadeService from '../services/cidadeService';
import asyncHandler from 'express-async-handler';

class CidadeController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const cidade = await cidadeService.create(req.body);
    res.status(201).json(cidade);
  });

  findAllByEstado = asyncHandler(async (req: Request, res: Response) => {
    const id_estado = parseInt(req.params.id_estado);
    const cidades = await cidadeService.findAllByEstado(id_estado);
    res.status(200).json(cidades);
  });
}

export default new CidadeController();