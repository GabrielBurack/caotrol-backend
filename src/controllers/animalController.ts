import { Request, Response } from 'express';
import animalService from '../services/animalService';
import asyncHandler from 'express-async-handler';

class AnimalController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const animal = await animalService.create(req.body);
    res.status(201).json(animal);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const busca = req.query.busca as string | undefined;
    const animais = await animalService.findAll(page, limit, busca);
    res.status(200).json(animais);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const animal = await animalService.findById(id);
    res.status(200).json(animal);
  });

  findAllByTutor = asyncHandler(async (req: Request, res: Response) => {
    const id_tutor = parseInt(req.params.id_tutor);
    const animais = await animalService.findAllByTutor(id_tutor);
    res.status(200).json(animais);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const animal = await animalService.update(id, req.body);
    res.status(200).json(animal);
  });

  deactivate = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await animalService.deactivate(id);
    res.status(204).send();
  });
}

export default new AnimalController();