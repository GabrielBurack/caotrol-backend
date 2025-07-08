// src/controllers/animalController.ts

import { Request, Response } from 'express';
import animalService from '../services/animalService';
import { Prisma } from '@prisma/client';

class AnimalController {
  async create(req: Request, res: Response) {
    try {
      const animal = await animalService.create(req.body);
      res.status(201).json(animal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const animais = await animalService.findAll();
      res.status(200).json(animais);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'O ID fornecido não é um número válido.' });
      }

      const animal = await animalService.findById(id);
      if (animal) {
        res.status(200).json(animal);
      } else {
        res.status(404).json({ message: 'Animal não encontrado.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
       if (isNaN(id)) {
        return res.status(400).json({ message: 'O ID fornecido não é um número válido.' });
      }

      const animal = await animalService.update(id, req.body);
      res.status(200).json(animal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deactivate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
       if (isNaN(id)) {
        return res.status(400).json({ message: 'O ID fornecido não é um número válido.' });
      }

      await animalService.deactivate(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AnimalController();