import { Prisma, tutor } from "@prisma/client";
import tutorRepository from "../repositories/tutorRepository";
import animalRepository from "../repositories/animalRepository";
import { NotFoundError, BadRequestError } from "../helpers/ApiError";
import estadoRepository from "../repositories/estadoRepository";
import cidadeRepository from "../repositories/cidadeRepository";
import prisma from "../prisma";


interface TutorCreateData {
    nome: string;
    cpf: string;
    telefone: string;
    data_nasc?: string;
    cep?: string;
    logradouro?: string;
    num?: string;
    bairro?: string;
    id_cidade?: number; 
}

class TutorService {

  async create(data: TutorCreateData): Promise<tutor> {
    const tutorExistente = await tutorRepository.findByCpf(data.cpf);
    if (tutorExistente) {
      throw new BadRequestError("Um tutor com este CPF já está cadastrado.");
    }

    // Validação: Se um id_cidade foi enviado, verifica se ele existe
    if (data.id_cidade) {
        const cidade = await cidadeRepository.findById(data.id_cidade);
        if (!cidade) {
            throw new NotFoundError("A cidade informada não foi encontrada.");
        }
    } 

    const dadosParaCriar: Prisma.tutorUncheckedCreateInput = {
      nome: data.nome,
      cpf: data.cpf,
      telefone: data.telefone, 
      data_nasc: data.data_nasc ? new Date(data.data_nasc) : undefined,
      cep: data.cep || undefined,
      logradouro: data.logradouro || undefined,
      num: data.num || undefined,
      bairro: data.bairro || undefined,
      id_cidade: data.id_cidade || undefined,
    };
    return tutorRepository.create(dadosParaCriar);
  }

  async findAll(page: number, limit: number, busca?: string, ordenarPor?: string) {
    const skip = (page - 1) * limit;
    const [tutores, total] = await Promise.all([
      tutorRepository.findAll(skip, limit, busca, ordenarPor),
      tutorRepository.countAll(busca),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      data: tutores,
      total,
      totalPages,
      currentPage: page,
    };
  }

  async search(termo: string) {
    if (!termo || termo.trim().length < 2) {
      return [];
    }
    return tutorRepository.searchByNameOrCpf(termo);
  }

  async findById(id: number): Promise<tutor> {
    const tutor = await tutorRepository.findById(id);
    if (!tutor) {
      throw new NotFoundError("Tutor não encontrado.");
    }
    return tutor;
  }

  async findAnimaisDoTutor(id_tutor: number) {
    await this.findById(id_tutor);
    return animalRepository.findAllByTutorId(id_tutor);
  }

  async update(id: number, data: Partial<tutor>): Promise<tutor> {
    //Garante que o tutor existe antes de tentar atualizar
    await this.findById(id);
    return tutorRepository.update(id, data);
  }

  async deactivate(id: number): Promise<tutor> {
    await this.findById(id);

    const transacaoResultados = await prisma.$transaction([
      prisma.tutor.update({
        where: { id_tutor: id },
        data: { ativo: false },
      }),
      prisma.animal.updateMany({
        where: { id_tutor: id },
        data: { ativo: false },
      })
    ]);
    
    const tutorDesativado = transacaoResultados[0];
    
    return tutorDesativado;
  }
}

export default new TutorService();