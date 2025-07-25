import { Request, Response } from "express";
import veterinarioService from "../services/veterinarioService";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


class VeterinarioController {
  async create(req: Request, res: Response) {
    try {
      const veterinario = await veterinarioService.create(req.body);
      res.status(201).json(veterinario);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const veterinarios = await veterinarioService.findAll();
      res.status(200).json(veterinarios);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res
          .status(400)
          .json({ message: "O ID fornecido não é um número válido." });
        return
      }

      const veterinario = await veterinarioService.findById(id);
      if (veterinario) {
        res.status(200).json(veterinario);
      } else {
        res.status(404).json({ message: "Veterinário não encontrado." });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res
          .status(400)
          .json({ message: "O ID fornecido não é um número válido." });
        return
      }

      const veterinario = await veterinarioService.update(id, req.body);
      res.status(200).json(veterinario);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res
          .status(400)
          .json({ message: "O ID fornecido não é um número válido." });
        return
      }

      await veterinarioService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        res.status(409).json({
          message:
            "Erro: Este veterinário não pode ser deletado pois está associado a agendamentos ou consultas.",
        });
        return
      }
      res.status(400).json({ message: error.message });
    }
  }
}

export default new VeterinarioController();