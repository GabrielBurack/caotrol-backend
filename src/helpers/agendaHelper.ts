import { agendamento } from "@prisma/client";

export const HORARIOS_FIXOS = [
  "09:00","09:30","10:00","10:30","11:00","11:30","12:00",
  "12:30","14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00",
];

const TAMANHO_SLOT_MIN = 30;
const DURACAO_CONSULTA_MINUTOS = 60; // mude aqui se precisar
const SLOTS_POR_CONSULTA = DURACAO_CONSULTA_MINUTOS / TAMANHO_SLOT_MIN;

function addMinutesToTimeStr(hhmm: string, minutes: number): string | null {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  const t = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  return HORARIOS_FIXOS.includes(t) ? t : null; // só vale se continuar dentro da grade fixa
}

export function calcularHorariosDisponiveis(agendamentosDoDia: agendamento[]): string[] {
  const ocupados = new Set<string>();

  // Marca todos os slots ocupados pelos agendamentos existentes
  agendamentosDoDia.forEach((ag) => {
    const inicio = new Date(ag.data_exec);
    for (let i = 0; i < SLOTS_POR_CONSULTA; i++) {
      const slot = new Date(inicio);
      slot.setMinutes(slot.getMinutes() + i * TAMANHO_SLOT_MIN);
      const hhmm = slot.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo",
      });
      if (HORARIOS_FIXOS.includes(hhmm)) ocupados.add(hhmm);
    }
  });

  // Um horário de início só é válido se TODOS os slots que ele precisa estiverem livres
  return HORARIOS_FIXOS.filter((inicio) => {
    for (let i = 0; i < SLOTS_POR_CONSULTA; i++) {
      const slot = addMinutesToTimeStr(inicio, i * TAMANHO_SLOT_MIN);
      if (!slot || ocupados.has(slot)) return false; // estoura a grade ou conflita
    }
    return true;
  });
}
