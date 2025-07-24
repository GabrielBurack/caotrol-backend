import agendamentoRepository from '../repositories/agendamentoRepository';
import userRepository from '../repositories/userRepository';
import { tipo_usuario_enum } from '@prisma/client'; 

class DashboardService {

  async getDashboardData(usuario_logado: { id: number; tipo: string }, filtroVeterinarioAtivo: boolean) {
    const hojeInicio = new Date();
    hojeInicio.setHours(0, 0, 0, 0);

    const hojeFim = new Date();
    hojeFim.setHours(23, 59, 59, 999);

    const resumoDiario = await agendamentoRepository.getContagensDoDia(hojeInicio, hojeFim);

    let id_veterinario_filtro: number | undefined = undefined;

    // 1. Verifica se o filtro foi solicitado E se o usuário é um veterinário
    if (filtroVeterinarioAtivo && usuario_logado.tipo === tipo_usuario_enum.veterinario) {
        // 2. Se a condição for verdadeira, busca o usuário para pegar o id_veterinario associado
        const usuario = await userRepository.findById(usuario_logado.id);
        if (usuario && usuario.id_veterinario) {
            id_veterinario_filtro = usuario.id_veterinario;
        } else {
            // Caso raro: usuário é do tipo veterinario, mas não tem id_veterinario vinculado
            return { resumoDiario, proximasConsultas: [] };
        }
    } else if (filtroVeterinarioAtivo && usuario_logado.tipo !== tipo_usuario_enum.veterinario) {
        // 3. Se o filtro foi solicitado, MAS o usuário não é veterinário, retorna uma lista vazia
        // Isso impede que um usuário comum tente usar o filtro e veja algo que não deveria.
        return { resumoDiario, proximasConsultas: [] };
    }
    
    // 4. Se o filtro não foi solicitado (ou se foi e o usuário é um veterinário válido), a busca continua.
    const proximasConsultas = await agendamentoRepository.getProximosAgendamentos(new Date(), hojeFim, id_veterinario_filtro);
    
    return { resumoDiario, proximasConsultas };
  }
}

export default new DashboardService();