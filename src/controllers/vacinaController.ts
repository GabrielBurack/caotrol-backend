import { Request, Response } from 'express';
import vacinaService from '../services/vacinaService';

class VacinaController {
  async create(req: Request, res: Response) {
    try {
      const id_animal = parseInt(req.params.id_animal);
      const novaVacina = await vacinaService.registrar(id_animal, req.body);
      res.status(201).json(novaVacina);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAllByAnimal(req: Request, res: Response) {
    try {
        const id_animal = parseInt(req.params.id_animal);
        const vacinas = await vacinaService.buscarPorAnimal(id_animal);
        res.status(200).json(vacinas);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
      try {
          const id_vacina = parseInt(req.params.id_vacina);
          await vacinaService.deletar(id_vacina);
          res.status(204).send();
      } catch (error: any) {
          res.status(400).json({ message: error.message });
      }
  }
}

export default new VacinaController();