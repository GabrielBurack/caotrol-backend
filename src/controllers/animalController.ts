// src/controllers/animalController.ts

import { Request, Response } from 'express';
import animalService from '../services/animalService';
import { Prisma } from '@prisma/client';

class AnimalController {
  /**
   * Cria um novo animal.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const animal = await animalService.create(req.body);
      res.status(201).json(animal);
    } catch (error: any) {
      // Trata erros de validação do serviço (ex: campo faltando)
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Busca todos os animais.
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10; // Padrão de 10 por página
      const animais = await animalService.findAll(page, limit);
      res.status(200).json(animais);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao buscar animais.' });
    }
  }

  /**
   * Busca um animal pelo seu ID.
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        // Correção: remove 'return' e adiciona 'return;' na linha seguinte
        res.status(400).json({ message: 'O ID fornecido não é um número válido.' });
        return;
      }

      const animal = await animalService.findById(id);
      if (animal) {
        res.status(200).json(animal);
      } else {
        res.status(404).json({ message: 'Animal não encontrado.' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao buscar o animal.' });
    }
  }

  /**
   * Atualiza os dados de um animal.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        // Correção: remove 'return' e adiciona 'return;' na linha seguinte
        res.status(400).json({ message: 'O ID fornecido não é um número válido.' });
        return;
      }

      const animal = await animalService.update(id, req.body);
      res.status(200).json(animal);
    } catch (error: any) {
      // Melhoria: Tratar erro de "não encontrado" especificamente
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).json({ message: 'Animal não encontrado para atualização.' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  /**
   * Desativa um animal (soft delete).
   */
  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        // Correção: remove 'return' e adiciona 'return;' na linha seguinte
        res.status(400).json({ message: 'O ID fornecido não é um número válido.' });
        return;
      }

      await animalService.deactivate(id);
      res.status(204).send(); // 204 No Content é perfeito para esta ação
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).json({ message: 'Animal não encontrado para desativar.' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default new AnimalController();