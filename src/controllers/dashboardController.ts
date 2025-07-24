// src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import dashboardService from '../services/dashboardService';

class DashboardController {
  async getData(req: Request, res: Response) {
    try {
      const filtro = req.query.filtro as string;
      const filtroVeterinarioAtivo = (filtro === 'meus');
      
      // req.usuario contém { id, tipo } e é garantido pelo authMiddleware
      const usuario_logado = req.usuario!; 

      const dashboardData = await dashboardService.getDashboardData(usuario_logado, filtroVeterinarioAtivo);
      
      res.status(200).json(dashboardData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new DashboardController();