import { consulta, Prisma, status_consulta_enum } from '@prisma/client';
import consultaRepository from '../repositories/consultaRepository';
import agendamentoRepository from '../repositories/agendamentoRepository';
import tutorRepository from '../repositories/tutorRepository';
import animalRepository from '../repositories/animalRepository';
import veterinarioRepository from '../repositories/veterinarioRepository';

interface DadosConsulta {
  data: Date;
  peso?: number;
  altura?: number;
  queixa: string;
  diagnostico?: string;
  tratamento?: string;
  prescricao?: { descricao: string }[];
  exame?: { solicitacao: string }[];
}

class ConsultaService {
  
  async registrarConsultaAgendada(id_agendamento: number, dadosConsulta: DadosConsulta): Promise<consulta> {
    const agendamento = await agendamentoRepository.findById(id_agendamento);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado.');
    }
    if (agendamento.status !== 'confirmada' && agendamento.status !== 'pendente') {
      throw new Error(`Não é possível iniciar uma consulta de um agendamento com status '${agendamento.status}'.`);
    }

    const dadosParaCriar: Prisma.consultaCreateInput = {
      ...dadosConsulta,
      status: status_consulta_enum.finalizada,
      animal: { connect: { id_animal: agendamento.id_animal } },
      veterinario: { connect: { id_veterinario: agendamento.id_veterinario } },
      prescricao: {
        create: dadosConsulta.prescricao
      },
      exame: {
        create: dadosConsulta.exame
      }
    };

    const novaConsulta = await consultaRepository.create(dadosParaCriar);
    
    await agendamentoRepository.update(id_agendamento, {
      consulta: { connect: { id_consulta: novaConsulta.id_consulta } }
    });
    
    return novaConsulta;
  }

  async registrarConsultaSemAgendamento(
    ids: { id_tutor: number; id_animal: number; id_veterinario: number },
    dadosConsulta: DadosConsulta
  ): Promise<consulta> {
    const { id_tutor, id_animal, id_veterinario } = ids;

    const tutor = await tutorRepository.findById(id_tutor);
    if (!tutor) throw new Error('Tutor não encontrado.');
    const animal = await animalRepository.findById(id_animal);
    if (!animal) throw new Error('Animal não encontrado.');
    const veterinario = await veterinarioRepository.findById(id_veterinario);
    if (!veterinario) throw new Error('Veterinário não encontrado.');
    if (animal.id_tutor !== tutor.id_tutor) {
      throw new Error('Este animal não pertence ao tutor informado.');
    }

     const dadosParaCriar: Prisma.consultaCreateInput = {
      ...dadosConsulta,
      status: status_consulta_enum.finalizada, 
      animal: { connect: { id_animal } },
      veterinario: { connect: { id_veterinario } },
      prescricao: {
        create: dadosConsulta.prescricao
      },
      exame: {
        create: dadosConsulta.exame
      }
    };
    
    return consultaRepository.create(dadosParaCriar);
  }
}

export default new ConsultaService();