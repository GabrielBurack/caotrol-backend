import { Prisma, tutor } from "@prisma/client";
import tutorRepository from "../repositories/tutorRepository";
import animalRepository from "../repositories/animalRepository";
import { NotFoundError, BadRequestError } from "../helpers/ApiError";
import estadoRepository from "../repositories/estadoRepository";
import cidadeRepository from "../repositories/cidadeRepository";

interface TutorCreateData {
  nome: string;
  cpf: string;
  telefone: string;
  data_nasc?: string;
  cep: string;
  rua: string;
  num: string;
  bairro: string;
  cidade: string;
  uf: string;
  estado: string;
}

class TutorService {
  async create(data: TutorCreateData): Promise<tutor> {
    console.log('2. Serviço iniciou a criação do tutor.');
    const tutorExistente = await tutorRepository.findByCpf(data.cpf);
    if (tutorExistente) {
      throw new BadRequestError("Um tutor com este CPF já está cadastrado.");
    }

    console.log(`Buscando estado com UF: ${data.uf}`);
    // Lógica "Encontre ou Crie" para o Estado
    let estado = await estadoRepository.findByUf(data.uf);
    if (!estado) {
      console.log(`Estado com UF ${data.uf} não encontrado, criando novo...`);
      // Se o estado não existe, cria um novo usando o nome completo e a UF
      estado = await estadoRepository.create({ nome: data.estado, uf: data.uf });
      console.log('Novo estado criado:', estado);
    } else {
      console.log('Estado encontrado:', estado);
    }

    console.log(`Buscando cidade: ${data.cidade} no estado ID: ${estado.id_estado}`);
    // Lógica "Encontre ou Crie" para a Cidade
    let cidade = await cidadeRepository.findByNomeAndEstado(data.cidade, estado.id_estado);
    if (!cidade) {
      console.log(`Cidade ${data.cidade} не encontrada, criando nova...`);
      cidade = await cidadeRepository.create({ nome: data.cidade, id_estado: estado.id_estado });
    } else {
      console.log('Cidade encontrada:', cidade);
    }

    const dadosParaCriar: Prisma.tutorUncheckedCreateInput= {
      nome: data.nome,
      cpf: data.cpf,
      telefone: data.telefone,
      data_nasc: data.data_nasc ? new Date(data.data_nasc) : null,
      cep: data.cep,
      rua: data.rua,
      num: data.num,
      bairro: data.bairro,
      id_cidade: cidade.id_cidade
    };
    console.log('Enviando dados finais para o repositório de tutor...');
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
    return tutorRepository.deactivate(id);
  }
}

export default new TutorService();