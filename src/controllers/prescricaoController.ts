import { Request, Response } from 'express';
import prescricaoService from '../services/prescricaoService';
import asyncHandler from 'express-async-handler';

class PrescricaoController {

  findAllByAnimal = asyncHandler(async (req: Request, res: Response) => {
    const id_animal = parseInt(req.params.id_animal);
    const historico = await prescricaoService.findAllByAnimal(id_animal);
    res.status(200).json(historico);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id_prescricao = parseInt(req.params.id_prescricao);
    const prescricaoAtualizado = await prescricaoService.update(id_prescricao, req.body);
    res.status(200).json(prescricaoAtualizado);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id_prescricao = parseInt(req.params.id_prescricao);
    await prescricaoService.delete(id_prescricao);
    res.status(204).send();
  });
}

export default new PrescricaoController();