import { PrismaClient, tipo_usuario_enum } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding do banco de dados...');

  // Limpa os dados existentes para evitar duplicatas (cuidado em produção!)
  await prisma.animal.deleteMany();
  await prisma.tutor.deleteMany();
  await prisma.raca.deleteMany();
  await prisma.especie.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.veterinario.deleteMany();

  // --- Nível 1: Entidades sem dependências externas ---

  console.log('Criando espécies...');
  const especieCanina = await prisma.especie.create({ data: { nome: 'Cachorro' } });
  const especieFelina = await prisma.especie.create({ data: { nome: 'Gato' } });

  // --- Nível 2: Entidades que dependem do Nível 1 ---

  console.log('Criando raças...');
  await prisma.raca.createMany({
    data: [
      { nome: 'Sem Raça Definida (SRD)', id_especie: especieCanina.id_especie },
      { nome: 'Golden Retriever', id_especie: especieCanina.id_especie },
      { nome: 'Persa', id_especie: especieFelina.id_especie },
      { nome: 'Siamês', id_especie: especieFelina.id_especie },
    ],
  });
  const racaSRD = await prisma.raca.findFirst({ where: { nome: 'Sem Raça Definida (SRD)' } });

  console.log('Criando veterinário...');
  const drJose = await prisma.veterinario.create({
    data: {
      nome: 'Dr. José Lauro',
      cpf: '11122233344',
      crmv: 'CRMV-PR-12345',
    },
  });

  // --- Nível 3: Usuários (que podem depender do Nível 2) ---

  console.log('Criando usuários...');
  const salt = await bcrypt.genSalt(10);
  const senhaPadraoHash = await bcrypt.hash('123456', salt);

  const adminUser = await prisma.usuario.create({
    data: {
      login: 'admin',
      senha: senhaPadraoHash,
      tipo: tipo_usuario_enum.admin,
    },
  });

  const vetUser = await prisma.usuario.create({
    data: {
      login: 'dr.jose',
      senha: senhaPadraoHash,
      tipo: tipo_usuario_enum.veterinario,
      id_veterinario: drJose.id_veterinario, // Vincula o usuário ao registro de veterinário
    },
  });

  // --- Nível 4: Entidades de Clientes e Pacientes ---

  console.log('Criando tutor...');
  const tutorExemplo = await prisma.tutor.create({
    data: {
      nome: 'Maria Clara Souza',
      cpf: '99988877766',
      telefone: '42988776655',
    },
  });

  console.log('Criando animal...');
  const animalExemplo = await prisma.animal.create({
    data: {
      nome: 'Nina',
      data_nasc: new Date('2022-05-13'),
      sexo: 'F',
      id_tutor: tutorExemplo.id_tutor,
      id_raca: racaSRD!.id_raca,
    },
  });

  console.log('Criando um agendamento futuro...');
  const amanhã = new Date();
  amanhã.setDate(amanhã.getDate() + 1);
  amanhã.setHours(10, 0, 0, 0); // Define o horário para 10:00

  const agendamentoFuturo = await prisma.agendamento.create({
    data: {
      data_agenda: new Date(),
      data_exec: amanhã,
      status: 'agendada',
      id_tutor: tutorExemplo.id_tutor,
      id_animal: animalExemplo.id_animal,
      id_veterinario: drJose.id_veterinario,
      id_usuario: vetUser.id_usuario, // Usuário veterinário que agendou
    },
  });

  console.log('Criando uma consulta e agendamento passados (histórico)...');
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  ontem.setHours(14, 0, 0, 0); // Define o horário para 14:00

  // 1. Primeiro, cria o registro da consulta que aconteceu
  const consultaPassada = await prisma.consulta.create({
    data: {
      data: ontem,
      queixa: 'Animal com tosse seca há 2 dias.',
      diagnostico: 'Suspeita de gripe canina.',
      tratamento: 'Repouso e hidratação.',
      status: 'finalizada',
      id_animal: animalExemplo.id_animal,
      id_veterinario: drJose.id_veterinario,
    },
  });

  // 2. Depois, cria o agendamento que deu origem a essa consulta, já vinculando os dois
  const agendamentoPassado = await prisma.agendamento.create({
    data: {
      data_agenda: ontem,
      data_exec: ontem,
      status: 'confirmada', // Supondo que foi confirmada
      id_tutor: tutorExemplo.id_tutor,
      id_animal: animalExemplo.id_animal,
      id_veterinario: drJose.id_veterinario,
      id_usuario: adminUser.id_usuario, // Supondo que o admin agendou
      id_consulta: consultaPassada.id_consulta, // Vincula o agendamento à consulta
    },
  });

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });