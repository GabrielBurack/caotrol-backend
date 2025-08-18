import { Request, Response } from 'express';
import especieService from '../services/especieService';
import asyncHandler from 'express-async-handler';

class EspecieController {
  create = asyncHandler(async (req: Request, res: Response) => {
      const especie = await especieService.create(req.body);
      res.status(201).json(especie);
  });

  async findAll(req: Request, res: Response) {
    try {
      const especies = await especieService.findAll();
      res.status(200).json(especies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const especie = await especieService.findById(id);
      if (especie) {
        res.status(200).json(especie);
      } else {
        res.status(404).json({ message: 'Espécie não encontrada' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const especie = await especieService.update(id, req.body);
      res.status(200).json(especie);
    } catch (error: any) {
      res.status(404).json({ message: 'Espécie não encontrada para atualizar' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await especieService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: 'Espécie não encontrada para deletar' });
    }
  }
}

export default new EspecieController();