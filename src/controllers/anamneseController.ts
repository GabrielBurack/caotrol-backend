import { Request, Response } from 'express';
import anamneseService from '../services/anamneseService';

class AnamneseController {
  async create(req: Request, res: Response) {
    try {
      const id_consulta = parseInt(req.params.id_consulta);
      const dadosAnamnese = req.body;

      const novaAnamnese = await anamneseService.registrar(id_consulta, dadosAnamnese);
      res.status(201).json(novaAnamnese);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AnamneseController();