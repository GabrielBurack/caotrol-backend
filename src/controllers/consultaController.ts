import { Request, Response } from 'express';
import consultaService from '../services/consultaService';

class ConsultaController {
  
  async registrarConsultaAgendada(req: Request, res: Response) {
    try {
      const id_agendamento = parseInt(req.params.id_agendamento);
      const dadosConsulta = req.body;

      const novaConsulta = await consultaService.registrarConsultaAgendada(id_agendamento, dadosConsulta);
      res.status(201).json(novaConsulta);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Cria uma consulta avulsa (de encaixe), sem agendamento prévio.
   */
  async registrarConsultaSemAgendamento(req: Request, res: Response) {
    try {
      // O corpo da requisição deve conter os IDs e os dados clínicos
      const { ids, dadosConsulta } = req.body;
      if (!ids || !dadosConsulta) {
        return res.status(400).json({ message: 'O corpo da requisição deve conter "ids" e "dadosConsulta".' });
      }

      const novaConsulta = await consultaService.registrarConsultaSemAgendamento(ids, dadosConsulta);
      res.status(201).json(novaConsulta);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Busca todas as consultas de um animal específico para exibir o histórico.
   */
  async buscarConsultasDoAnimal(req: Request, res: Response) {
    try {
        const id_animal = parseInt(req.params.id_animal);
        const historico = await consultaRepository.findAllByAnimalId(id_animal); // Supondo que o método esteja no repositório
        res.status(200).json(historico);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
  }

  /**
   * Busca uma consulta específica por seu ID.
   */
  async buscarPorId(req: Request, res: Response) {
      try {
          const id_consulta = parseInt(req.params.id_consulta);
          const consulta = await consultaRepository.findById(id_consulta); // Supondo que o método esteja no repositório
          if (!consulta) {
              return res.status(404).json({ message: 'Consulta não encontrada.' });
          }
          res.status(200).json(consulta);
      } catch (error: any) {
          res.status(500).json({ message: error.message });
      }
  }
}

// Para usar as funções do repositório aqui, você precisaria importá-lo:
import consultaRepository from '../repositories/consultaRepository';

export default new ConsultaController();