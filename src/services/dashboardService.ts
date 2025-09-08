import agendamentoRepository from '../repositories/agendamentoRepository';
import userRepository from '../repositories/userRepository';
import { tipo_usuario_enum } from '@prisma/client';

class DashboardService {

  async getDashboardData(usuario_logado: { id: number; tipo: string; id_veterinario?: number },
    id_vet_filtro_param?: string) {

    const hojeInicio = new Date();
    hojeInicio.setHours(0, 0, 0, 0);

    const hojeFim = new Date();
    hojeFim.setHours(23, 59, 59, 999);

    let id_veterinario_final: number | undefined = undefined;

    if (id_vet_filtro_param && id_vet_filtro_param !== 'todos') {
      // 1. Se um filtro explícito foi enviado (ex: idVet = 1)
      id_veterinario_final = parseInt(id_vet_filtro_param);
    } else if (!id_vet_filtro_param) {
      // 2. Se NENHUM filtro foi enviado, aplica o padrão
      if (usuario_logado.tipo === tipo_usuario_enum.veterinario) {
        // Padrão para veterinário: mostrar apenas os seus dados 
        id_veterinario_final = usuario_logado.id_veterinario;
      }
      // Se não for veterinário (admin/recepção), o id_veterinario_final continua undefined,
      // mostrando os dados de todos, como é o padrão para eles 
    }
    // 3. Se o filtro for 'todos', id_veterinario_final continua undefined, mostrando tudo.


    // O mesmo ID de filtro é passado para AMBAS as funções, garantindo consistência
    const resumoDiario = await agendamentoRepository.getContagensDoDia(hojeInicio, hojeFim, id_veterinario_final);
    const proximasConsultas = await agendamentoRepository.getProximosAgendamentos(new Date(), hojeFim, id_veterinario_final);
    
    return { resumoDiario, proximasConsultas };
  }
}

export default new DashboardService();