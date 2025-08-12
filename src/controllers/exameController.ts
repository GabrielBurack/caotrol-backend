import { Request, Response } from 'express';
import exameService from '../services/exameService';
import asyncHandler from 'express-async-handler';

class ExameController {

  findAllByAnimal = asyncHandler(async (req: Request, res: Response) => {
    const id_animal = parseInt(req.params.id_animal);
    const historico = await exameService.findAllByAnimal(id_animal);
    res.status(200).json(historico);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id_exame = parseInt(req.params.id_exame);
    const exameAtualizado = await exameService.update(id_exame, req.body);
    res.status(200).json(exameAtualizado);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id_exame = parseInt(req.params.id_exame);
    await exameService.delete(id_exame);
    res.status(204).send();
  });
}

export default new ExameController();