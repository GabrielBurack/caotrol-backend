import { Request, Response } from 'express';
import tutorService from '../services/tutorService';
import asyncHandler from 'express-async-handler';

class TutorController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const novoTutor = await tutorService.create(req.body);
    res.status(201).json(novoTutor);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const busca = req.query.busca as string | undefined;

    const resultadoPaginado = await tutorService.findAll(page, limit, busca);
    res.status(200).json(resultadoPaginado);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const tutor = await tutorService.findById(id);
    res.status(200).json(tutor);
  });
  
  findAnimaisDoTutor = asyncHandler(async (req: Request, res: Response) => {
    const id_tutor = parseInt(req.params.id);
    const animais = await tutorService.findAnimaisDoTutor(id_tutor);
    res.status(200).json(animais);
  });

  search = asyncHandler(async (req: Request, res: Response) => {
    const termo = req.query.termo as string | undefined;
    if (!termo) {
      res.status(200).json([]);
      return; 
    }
    const resultados = await tutorService.search(termo);
    res.status(200).json(resultados);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const tutorAtualizado = await tutorService.update(id, req.body);
    res.status(200).json(tutorAtualizado);
  });

  deactivate = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await tutorService.deactivate(id);
    res.status(204).send();
  });
}

export default new TutorController();