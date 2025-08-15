import { Request, Response } from 'express';
import estadoService from '../services/estadoService';
import asyncHandler from 'express-async-handler';

class EstadoController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const estado = await estadoService.create(req.body);
    res.status(201).json(estado);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const estados = await estadoService.findAll();
    res.status(200).json(estados);
  });
}

export default new EstadoController();