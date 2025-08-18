import { Request, Response } from 'express';
import especieService from '../services/especieService';
import asyncHandler from 'express-async-handler';

class EspecieController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const especie = await especieService.create(req.body);
    res.status(201).json(especie);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const especies = await especieService.findAll();
    res.status(200).json(especies);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const especie = await especieService.findById(id);
    res.status(200).json(especie);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const especie = await especieService.update(id, req.body);
    res.status(200).json(especie);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await especieService.delete(id);
    res.status(204).send();
  });
}

export default new EspecieController();
