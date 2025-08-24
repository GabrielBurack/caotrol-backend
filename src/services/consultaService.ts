import { consulta, Prisma, status_consulta_enum } from "@prisma/client";
import consultaRepository from "../repositories/consultaRepository";
import agendamentoRepository from "../repositories/agendamentoRepository";
import tutorRepository from "../repositories/tutorRepository";
import animalRepository from "../repositories/animalRepository";
import veterinarioRepository from "../repositories/veterinarioRepository";
import userRepository from "../repositories/userRepository";
import { BadRequestError, NotFoundError } from "../helpers/ApiError";

interface DadosConsulta {
  data: Date;
  peso?: number;
  altura?: number;
  queixa: string;
  diagnostico?: string;
  tratamento?: string;
  prescricao?: { descricao: string }[];
  exame?: { solicitacao: string }[];
  anamnese?: { 
    castrado?: boolean;
    alergias?: string;
    obs?: string;
  };
}

class ConsultaService {
  async findAll(
    page: number,
    limit: number,
    busca?: string,
    dataInicio?: Date,
    dataFim?: Date,
    ordenarPor?: string
  ) {
    const skip = (page - 1) * limit;

    const [consultas, total] = await Promise.all([
      consultaRepository.findAll(skip, limit, busca, dataInicio, dataFim,ordenarPor), 
      consultaRepository.countAll(busca, dataInicio, dataFim),
    ]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = page;

    return {
      data: consultas,
      total,
      totalPages,
      currentPage,
    };
  }

  async registrarConsultaAgendada(
    id_agendamento: number,
    dadosConsulta: DadosConsulta
  ): Promise<consulta> {
    const agendamento = await agendamentoRepository.findById(id_agendamento);
    if (!agendamento) {
      throw new Error("Agendamento não encontrado.");
    }
    if (
      agendamento.status !== "confirmada" &&
      agendamento.status !== "pendente"
    ) {
      throw new Error(
        `Não é possível iniciar uma consulta de um agendamento com status '${agendamento.status}'.`
      );
    }

    const dadosParaCriar: Prisma.consultaCreateInput = {
      ...dadosConsulta,
      data: agendamento.data_exec,
      status: status_consulta_enum.finalizada,
      animal: { connect: { id_animal: agendamento.id_animal } },
      veterinario: { connect: { id_veterinario: agendamento.id_veterinario } },
      anamnese: {
        create: dadosConsulta.anamnese // Envelopa os dados da anamnese em 'create'
      },
      prescricao: {
        create: dadosConsulta.prescricao,
      },
      exame: {
        create: dadosConsulta.exame,
      },
    };

    const novaConsulta = await consultaRepository.create(dadosParaCriar);

    await agendamentoRepository.update(id_agendamento, {
      consulta: { connect: { id_consulta: novaConsulta.id_consulta } },
    });

    return novaConsulta;
  }

  async registrarConsultaSemAgendamento(
    ids: { id_tutor: number; id_animal: number;},
    dadosConsulta: DadosConsulta,
    id_usuario_logado: number
  ): Promise<consulta> {
    const { id_tutor, id_animal } = ids;

    //O backend busca o usuário logado para encontrar seu perfil de veterinário
    const usuarioLogado = await userRepository.findById(id_usuario_logado);
    if (!usuarioLogado || !usuarioLogado.id_veterinario) {
      throw new BadRequestError("Usuário logado não é um veterinário válido ou não está associado a um perfil de veterinário.");
    }
    
    const id_veterinario_correto = usuarioLogado.id_veterinario;

    const tutor = await tutorRepository.findById(id_tutor);
    if (!tutor) throw new NotFoundError('Tutor não encontrado.');
    const animal = await animalRepository.findById(id_animal);
    if (!animal) throw new NotFoundError('Animal não encontrado.');
    if (animal.id_tutor !== tutor.id_tutor) {
      throw new BadRequestError('Este animal não pertence ao tutor informado.');
    }

    // 4. Prepara os dados para criar a consulta com o id_veterinario correto
    const { prescricao, exame, anamnese, ...dadosClinicos } = dadosConsulta;
    const dadosParaCriar: Prisma.consultaCreateInput = {
      ...dadosClinicos,
      status: status_consulta_enum.finalizada,
      animal: { connect: { id_animal } },
      veterinario: { connect: { id_veterinario: id_veterinario_correto } },
      prescricao: { create: prescricao },
      exame: { create: exame },
      anamnese: {create: anamnese}
    };
    
    return consultaRepository.create(dadosParaCriar);
  }
}

export default new ConsultaService();
