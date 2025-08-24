import { Request, Response } from "express";
import agendamentoService from "../services/agendamentoService";
import asyncHandler from "express-async-handler";

class AgendamentoController {

  listarHorariosDisponiveis = asyncHandler(async (req: Request, res: Response) => {
    const { id_veterinario, dia } = req.query;
    const horarios = await agendamentoService.listarHorariosDisponiveis(id_veterinario as string, dia as string);
    res.status(200).json(horarios);
  });

  agendar = asyncHandler(async (req: Request, res: Response) => {
    const agendamento = await agendamentoService.agendar(req.body);
    res.status(201).json(agendamento);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const agendamento = await agendamentoService.findById(id);
    res.status(200).json(agendamento);
  });

  confirmar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const agendamento = await agendamentoService.confirmar(id);
    res.status(200).json(agendamento);
  });

  cancelar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const agendamento = await agendamentoService.cancelar(id);
    res.status(200).json(agendamento);
  });

  buscarPorPeriodo = asyncHandler(async (req: Request, res: Response) => {
    const { start, end } = req.query;
    const eventos = await agendamentoService.buscarPorPeriodo(start as string, end as string);
    res.status(200).json(eventos);
  });

  marcarFalta = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const agendamentoAtualizado = await agendamentoService.marcarNaoComparecimento(id);
    res.status(200).json(agendamentoAtualizado);
  });
}

export default new AgendamentoController();