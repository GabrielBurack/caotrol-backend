// src/helpers/agendaHelper.ts
import { agendamento } from "@prisma/client";

// A lista de horários fixos agora vive aqui.
export const HORARIOS_FIXOS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "12:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
];

// Duração da consulta em minutos. Mudar aqui afeta todo o sistema.
const DURACAO_CONSULTA_MINUTOS = 60;

/**
 * Calcula os horários disponíveis com base nos agendamentos existentes.
 * @param agendamentosDoDia - Lista de agendamentos já marcados para o dia.
 * @returns Um array de strings com os horários disponíveis.
 */
export function calcularHorariosDisponiveis(agendamentosDoDia: agendamento[]): string[] {
  const horariosOcupados = new Set<string>();

  agendamentosDoDia.forEach((ag) => {
    const dataInicio = new Date(ag.data_exec);
    const slotsOcupados = DURACAO_CONSULTA_MINUTOS / 30; // Ex: 60 / 30 = 2 slots

    for (let i = 0; i < slotsOcupados; i++) {
      const slotDate = new Date(dataInicio);
      slotDate.setMinutes(slotDate.getMinutes() + (i * 30));

      const horarioSlot = slotDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo",
      });

      if (HORARIOS_FIXOS.includes(horarioSlot)) {
        horariosOcupados.add(horarioSlot);
      }
    }
  });

  return HORARIOS_FIXOS.filter((horario) => !horariosOcupados.has(horario));
}