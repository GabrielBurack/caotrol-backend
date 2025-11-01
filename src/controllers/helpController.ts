import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { NotFoundError } from '../helpers/ApiError';
import fs from 'fs/promises'; 
import path from 'path';

// Helper para evitar ataques "Path Traversal"
// Limpa o nome da página para garantir que ele só contenha letras e hífens
const sanitizePageKey = (key: string) => {
  return key.replace(/[^a-zA-Z0-9-]/g, '');
};

class HelpController {
  
  /**
   * Busca o conteúdo de ajuda de um arquivo JSON com base na chave da página.
   */
  getHelpContent = asyncHandler(async (req: Request, res: Response) => {
    const pageKey = sanitizePageKey(req.params.pageKey);
    
    // Constrói o caminho para o arquivo JSON de forma segura
    const filePath = path.join(
      __dirname, // Caminho do diretório atual (ex: dist/controllers)
      '../help-content', // Volta para 'dist' e entra em 'help-content'
      `${pageKey}.json`
    );

    try {
      // Lê o conteúdo do arquivo
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Converte o conteúdo (string) para um objeto JSON
      const helpData = JSON.parse(fileContent);
      
      res.status(200).json(helpData);
    } catch (error) {
      // Se o arquivo não for encontrado (ex: 'arquivo.json' não existe)
      console.error(error);
      throw new NotFoundError('Tópico de ajuda não encontrado.');
    }
  });
}

export default new HelpController();