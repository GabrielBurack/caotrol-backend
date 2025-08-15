import { Request, Response } from 'express';
import enderecoService from '../services/enderecoService';
import asyncHandler from 'express-async-handler';

class EnderecoController {
    
  findByCep = asyncHandler(async (req: Request, res: Response) => {
    const { cep } = req.params;
    const endereco = await enderecoService.findByCep(cep);
    res.status(200).json(endereco);
  });
}

export default new EnderecoController();