import { Request, Response } from 'express';
import anamneseService from '../services/anamneseService';
import asyncHandler from 'express-async-handler';

class AnamneseController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const id_consulta = parseInt(req.params.id_consulta);
    const novaAnamnese = await anamneseService.registrar(id_consulta, req.body);
    res.status(201).json(novaAnamnese);
  });

  findAllByAnimal = asyncHandler(async (req: Request, res: Response) => {
    const id_animal = parseInt(req.params.id_animal);
    const historico = await anamneseService.buscarHistoricoPorAnimal(id_animal);
    res.status(200).json(historico);
  });
}

export default new AnamneseController();