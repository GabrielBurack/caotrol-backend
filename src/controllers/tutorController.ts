import { NextFunction, Request, Response } from "express";
import tutorService from "../services/tutorService";

class TutorController {

    async create(req: Request, res: Response) {
        try {
            const novoTutor = await tutorService.create(req.body);
            res.status(201).json(novoTutor);

        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar tutor', error });
        }
    }



    async findAnimaisDoTutor(req: Request, res: Response) {
        try {
            const id_tutor = parseInt(req.params.id);
            const animais = await tutorService.findAnimaisDoTutor(id_tutor);
            res.status(200).json(animais);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            // Lê 'page' e 'limit' dos query params da URL (ex: /tutores?page=2&limit=10)
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10; // Padrão de 10 por página
            const busca = req.query.busca as string | undefined;

            const tutores = await tutorService.findAll(page, limit, busca);

            res.status(200).json(tutores);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar tutores', error });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const tutor = await tutorService.findById(id);

            if (tutor) {
                res.status(200).json(tutor);
            } else {
                res.status(404).json({ message: 'Tutor não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar tutor', error });
        }
    }

    async search(req: Request, res: Response, next: NextFunction) {
    try {
      const termo = req.query.termo as string | undefined;

      if (!termo) {
        return res.status(200).json([]); 
      }
      
      const resultados = await tutorService.search(termo);
      res.status(200).json(resultados);
    } catch (error) {
      next(error);
    }
  }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const tutorAtualizado = await tutorService.update(id, req.body);
            res.status(200).json(tutorAtualizado);

        } catch (error) {
            // Adicionar checagem para ver se o erro é porque o tutor não foi encontrado
            res.status(500).json({ message: 'Erro ao atualizar tutor', error });
        }
    }

    async deactivate(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await tutorService.deactivate(id);
            res.status(204).send(); // 204 No Content é uma resposta comum para delete bem-sucedido
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar tutor', error });
        }
    }
}

export default new TutorController();