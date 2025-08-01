import { Request, Response } from 'express';
import relatorioService from '../services/relatorioService';

class RelatorioController {
  async getRelatorioConsultas(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim } = req.query;

      if (!dataInicio || !dataFim) {
        res.status(400).json({ message: "Os parâmetros 'dataInicio' e 'dataFim' são obrigatórios." });
        return 
      }

      const relatorio = await relatorioService.gerarRelatorioConsultas(
        new Date(dataInicio as string),
        new Date(dataFim as string)
      );

      res.status(200).json(relatorio);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new RelatorioController();