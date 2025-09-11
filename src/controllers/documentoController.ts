import { Request, Response } from 'express';
import documentoService from '../services/documentoService';
import asyncHandler from 'express-async-handler';

class DocumentoController {
  // Para registros já salvos
  gerarPrescricao = asyncHandler(async (req: Request, res: Response) => {
    const id_prescricao = parseInt(req.params.id_prescricao);
    const pdfBuffer = await documentoService.gerarPdfPrescricao(id_prescricao);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=prescricao_${id_prescricao}.pdf`);
    res.send(pdfBuffer);
  });

  // Para preview (dados vêm do body)
  gerarPrescricaoPreview = asyncHandler(async (req: Request, res: Response) => {
    const pdfBuffer = await documentoService.gerarPdfPrescricaoPreview(req.body);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=prescricao_preview.pdf');
    res.send(pdfBuffer);
  });

  gerarExame = asyncHandler(async (req: Request, res: Response) => {
    const id_exame = parseInt(req.params.id_exame);
    const pdfBuffer = await documentoService.gerarPdfExame(id_exame);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=exame_${id_exame}.pdf`);
    res.send(pdfBuffer);
  });

  /**
   * Gera um PDF de uma solicitação de exame para PREVIEW (dados vêm do body).
   */
  gerarExamePreview = asyncHandler(async (req: Request, res: Response) => {
    const pdfBuffer = await documentoService.gerarPdfExamePreview(req.body);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=exame_preview.pdf');
    res.send(pdfBuffer);
  });

  // Gerar PDF de prescrições da consulta
  gerarPrescricoesDaConsulta = asyncHandler(async (req: Request, res: Response) => {
    const id_consulta = parseInt(req.params.id_consulta);
    const pdfBuffer = await documentoService.gerarPdfPrescricoesDaConsulta(id_consulta);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=receituario_consulta_${id_consulta}.pdf`);
    res.send(pdfBuffer);
  });

  // Gerar PDF de exames da consulta
  gerarExamesDaConsulta = asyncHandler(async (req: Request, res: Response) => {
    const id_consulta = parseInt(req.params.id_consulta);
    const pdfBuffer = await documentoService.gerarPdfExamesDaConsulta(id_consulta);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=exames_consulta_${id_consulta}.pdf`);
    res.send(pdfBuffer);
  });
}

export default new DocumentoController();