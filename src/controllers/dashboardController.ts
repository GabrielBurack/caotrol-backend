import { Request, Response } from 'express';
import dashboardService from '../services/dashboardService';
import expressAsyncHandler from 'express-async-handler';

class DashboardController {
getData = expressAsyncHandler(async (req: Request, res: Response) => {
    const id_vet_filtro = req.query.id_vet_filtro as string | undefined;
    
    const usuario_logado = req.usuario!; 

    const dashboardData = await dashboardService.getDashboardData(usuario_logado, id_vet_filtro);
    
    res.status(200).json(dashboardData);
  });
}

export default new DashboardController();