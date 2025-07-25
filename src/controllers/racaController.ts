import { Request, Response } from "express";
import racaService from "../services/racaService";
import { Prisma } from '@prisma/client';

class RacaController {
    async create(req: Request, res: Response) {
        try {
            const raca = await racaService.create(req.body);
            res.status(201).json(raca);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const racas = await racaService.findAll();
            res.status(200).json(racas);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = +req.params.id;
            const raca = await racaService.findById(id);

            if (raca) {
                res.status(200).json(raca);
            } else {
                res.status(404).json({ message: 'Raça não encontrada.' });
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const raca = await racaService.update(id, req.body);
            res.status(200).json(raca);
        } catch (error: any) {
            res.status(404).json({ message: 'Erro ao atualizar raça: ' + error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await racaService.delete(id);
            res.status(204).send();

        } catch (error: any) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {

                // Se o código do erro é P2003 (falha de chave estrangeira)
                if (error.code === 'P2003') {
                    res.status(409).json({
                        message: 'Erro: Esta raça não pode ser deletada pois está associada a um ou mais animais.'
                    });
                    return
                }
            }

            res.status(400).json({
                message: error.message || 'Ocorreu um erro inesperado.'
            });
            return
        }
    }
}

export default new RacaController();