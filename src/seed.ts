import { PrismaClient, status_consulta_enum, tipo_usuario_enum } from "@prisma/client";
import bcrypt from 'bcryptjs';
import axios from "axios";

const prisma = new PrismaClient();

// Listas de raças
const racasCaes = ["Afegão Hound", "Affenpinscher", "Airedale Terrier", "Akita", "American Staffordshire Terrier",
  "Basenji", "Basset Hound", "Beagle", "Bichon Frisé", "Boiadeiro Australiano", "Boiadeiro Bernês",
  "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Boxer", "Buldogue Francês",
  "Buldogue Inglês", "Bull Terrier", "Cairn Terrier", "Cane Corso", "Cão de Água Português",
  "Cavalier King Charles Spaniel", "Chihuahua", "Chinês Cristado", "Chow Chow", "Cocker Spaniel Americano",
  "Cocker Spaniel Inglês", "Collie", "Coton de Tulear", "Dachshund", "Dálmata", "Doberman",
  "Dogo Argentino", "Dogue Alemão", "Dogue de Bordeaux", "Fila Brasileiro", "Fox Terrier",
  "Golden Retriever", "Grande Pirineus", "Greyhound", "Griffon de Bruxelas", "Husky Siberiano",
  "Jack Russell Terrier", "Komondor", "Labrador Retriever", "Lakeland Terrier", "Lhasa Apso",
  "Malamute do Alasca", "Maltês", "Mastiff", "Mastim Napolitano", "Mastim Tibetano",
  "Norwich Terrier", "Papillon", "Pastor Alemão", "Pastor Australiano", "Pastor Belga",
  "Pastor de Shetland", "Pequinês", "Pinscher Miniatura", "Pit Bull", "Pointer", "Poodle",
  "Pug", "Rhodesian Ridgeback", "Rottweiler", "Samoieda", "São Bernardo", "Schnauzer",
  "Scottish Terrier", "Setter Irlandês", "Shar-Pei", "Shiba Inu", "Shih Tzu", "Skye Terrier", "Spitz Alemão",
  "Staffordshire Bull Terrier", "Terra Nova", "Weimaraner", "Welsh Corgi (Cardigan)",
  "Welsh Corgi (Pembroke)", "West Highland White Terrier", "Whippet", "Yorkshire Terrier",
  "Sem Raça Definida (SRD)"];

const racasGatos = ["Abissínio", "American Shorthair", "Angorá", "Ashera", "Azul Russo", "Bengal", "Bobtail Americano",
  "Bobtail Japonês", "Bombaim", "Burmês", "Chartreux", "Cornish Rex", "Devon Rex", "Exótico",
  "Himalaio", "Maine Coon", "Manx", "Munchkin", "Norueguês da Floresta", "Ocicat", "Oriental",
  "Persa", "Ragdoll", "Sagrado da Birmânia", "Savannah", "Scottish Fold", "Siamês", "Siberiano",
  "Singapura", "Somali", "Sphynx", "Tonquinês", "Toyger", "Sem Raça Definida (SRD)"];

// --- INÍCIO DAS NOVAS ADIÇÕES: DADOS E FUNÇÕES AUXILIARES ---

// Arrays de dados para geração de nomes fictícios
const primeirosNomes = ["Ana", "Carlos", "Beatriz", "João", "Mariana", "Pedro", "Juliana", "Lucas", "Fernanda", "Rafael", "Camila", "Gustavo", "Larissa", "Thiago", "Letícia", "Bruno", "Amanda", "Felipe", "Gabriela", "Vinícius"];
const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Melo", "Barbosa", "Nunes", "Lopes", "Marques"];
const nomesAnimais = ["Thor", "Luna", "Simba", "Mel", "Bob", "Lola", "Max", "Nina", "Zeus", "Maggie", "Luke", "Bella", "Chico", "Frida", "Toby", "Cacau", "Fred", "Maya", "Rocky", "Lua"];
const motivosConsulta = ["Check-up anual", "Vacinação", "Apatia e falta de apetite", "Problemas de pele", "Vômito e diarreia", "Tosse persistente", "Dificuldade para urinar", "Curativo", "Consulta de rotina", "Acompanhamento pós-cirúrgico"];

/**
 * Função para retornar um item aleatório de um array.
 * @param arr O array do qual um item será selecionado.
 * @returns Um item aleatório do array.
 */
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Função para gerar uma data aleatória dentro de um intervalo.
 * @param start A data de início do intervalo.
 * @param end A data de fim do intervalo.
 * @returns Um objeto Date aleatório.
 */
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// --- FIM DAS NOVAS ADIÇÕES ---

async function main() {
  console.log('Iniciando o seeding completo do banco de dados...');

  // 1. LIMPEZA COMPLETA DO BANCO
  console.log('Deletando dados antigos...');
  await prisma.anamnese.deleteMany({});
  await prisma.prescricao.deleteMany({});
  await prisma.exame.deleteMany({});
  await prisma.vacina.deleteMany({});
  await prisma.consulta.deleteMany({});
  await prisma.agendamento.deleteMany({});
  await prisma.animal.deleteMany({});
  await prisma.tutor.deleteMany({});
  await prisma.cidade.deleteMany({});
  await prisma.estado.deleteMany({});
  await prisma.raca.deleteMany({});
  await prisma.especie.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.veterinario.deleteMany({});
  console.log('✅ Dados antigos limpos.');

  // 2. POPULANDO ESTADOS E CIDADES
  console.log("🔄 Buscando e criando estados e cidades do IBGE...");
  const responseEstados = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
  const estadosParaCriar = responseEstados.data.map((estado: any) => ({ nome: estado.nome, uf: estado.sigla }));
  await prisma.estado.createMany({ data: estadosParaCriar });
  const todosEstados = await prisma.estado.findMany();
  console.log(`✅ ${todosEstados.length} estados criados.`);

  for (const estado of todosEstados) {
    const responseCidades = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.uf}/municipios`);
    if (responseCidades.data?.length > 0) {
      const cidadesParaCriar = responseCidades.data.map((cidade: any) => ({ nome: cidade.nome, id_estado: estado.id_estado }));
      await prisma.cidade.createMany({ data: cidadesParaCriar });
    }
  }
  const todasCidades = await prisma.cidade.findMany(); // Carrega todas as cidades para uso posterior
  console.log("✅ Cidades inseridas com sucesso!");

  // 3. POPULANDO ESPÉCIES E RAÇAS
  console.log('🐾 Criando espécies e raças...');
  const especieCanina = await prisma.especie.create({ data: { nome: 'Canina' } });
  const especieFelina = await prisma.especie.create({ data: { nome: 'Felina' } });

  const caesParaCriar = racasCaes.map(nome => ({ nome: nome, id_especie: especieCanina.id_especie }));
  await prisma.raca.createMany({ data: caesParaCriar });

  const gatosParaCriar = racasGatos.map(nome => ({ nome: nome, id_especie: especieFelina.id_especie }));
  await prisma.raca.createMany({ data: gatosParaCriar });
  const todasRacas = await prisma.raca.findMany(); // Carrega todas as raças para uso posterior
  console.log(`✅ ${racasCaes.length} raças de cães e ${racasGatos.length} raças de gatos criadas.`);

  // 4. CRIANDO DADOS DE EXEMPLO DA CLÍNICA
  console.log('🏥 Criando dados de exemplo da clínica...');

  // --- Veterinários ---
const drJose = await prisma.veterinario.create({
  data: {
    nome: 'Dr. José Lauro',
    cpf: '11122233344',
    crmv: 'CRMV-PR-12345',
  },
});

// NOVO VETERINÁRIO ADICIONADO
const draAna = await prisma.veterinario.create({
  data: {
    nome: 'Dra. Ana Costa',
    cpf: '55566677788',
    crmv: 'CRMV-PR-54321',
  },
});
console.log('- Perfis de veterinários de exemplo criados.');


// --- Usuários ---
const salt = await bcrypt.genSalt(10);
const senhaPadraoHash = await bcrypt.hash('123456', salt);

const adminUser = await prisma.usuario.create({
  data: {
    login: 'admin',
    email: 'admin@caotrol.com',
    senha: senhaPadraoHash,
    tipo: tipo_usuario_enum.admin,
    email_verificado: true,
  },
});

const vetUserJose = await prisma.usuario.create({
  data: {
    login: 'dr.jose',
    email: 'dr.jose@caotrol.com',
    senha: senhaPadraoHash,
    tipo: tipo_usuario_enum.veterinario,
    id_veterinario: drJose.id_veterinario, // Vincula ao Dr. José
    email_verificado: true,
  },
});

// NOVO USUÁRIO VETERINÁRIO ADICIONADO
const vetUserAna = await prisma.usuario.create({
    data: {
      login: 'dra.ana',
      email: 'dra.ana@caotrol.com',
      senha: senhaPadraoHash,
      tipo: tipo_usuario_enum.veterinario,
      id_veterinario: draAna.id_veterinario, // Vincula à Dra. Ana
      email_verificado: true,
    },
});

// NOVO USUÁRIO PADRÃO ADICIONADO
const recepcaoUser = await prisma.usuario.create({
    data: {
      login: 'recepcao',
      email: 'recepcao@caotrol.com',
      senha: senhaPadraoHash,
      tipo: tipo_usuario_enum.padrao,
      email_verificado: true,
    },
});
console.log('- Usuários de exemplo (admin, veterinários, padrão) criados.');

  // Criar Tutor de exemplo
  const pontaGrossa = await prisma.cidade.findFirst({ where: { nome: 'Ponta Grossa' } });
  const tutorExemplo = await prisma.tutor.create({
    data: {
      nome: 'Maria Clara Souza',
      cpf: '99988877766',
      telefone: '42988776655',
      id_cidade: pontaGrossa?.id_cidade,
    },
  });
  console.log('- Tutor de exemplo criado.');

  // Criar Animal de exemplo
  const racaSRD = await prisma.raca.findFirst({ where: { nome: 'Sem Raça Definida (SRD)', id_especie: especieCanina.id_especie } });
  const animalExemplo = await prisma.animal.create({
    data: {
      nome: 'Nina',
      data_nasc: new Date('2022-05-13'),
      sexo: 'F',
      id_tutor: tutorExemplo.id_tutor,
      id_raca: racaSRD!.id_raca,
    },
  });
  console.log('- Animal de exemplo criado.');

  // --- INÍCIO DA NOVA SEÇÃO: CRIAÇÃO DE DADOS EM MASSA ---
  console.log('🔄 Criando 25 tutores e seus animais...');

  const tutoresCriados = [];
  const animaisCriados = [];

  for (let i = 0; i < 25; i++) {
    // Criação do Tutor
    const nomeCompleto = `${getRandomItem(primeirosNomes)} ${getRandomItem(sobrenomes)}`;
    const novoTutor = await prisma.tutor.create({
      data: {
        nome: nomeCompleto,
        cpf: String(Math.floor(10000000000 + Math.random() * 90000000000)), // Gera um CPF numérico aleatório de 11 dígitos
        telefone: `429${String(Math.floor(10000000 + Math.random() * 90000000))}`, // Gera um telefone aleatório
        id_cidade: getRandomItem(todasCidades).id_cidade,
      },
    });
    tutoresCriados.push(novoTutor);

    // Criação de 1 ou 2 animais para cada tutor
    const numeroDeAnimais = Math.floor(Math.random() * 2) + 1; // 1 ou 2
    for (let j = 0; j < numeroDeAnimais; j++) {
      const especieAleatoria = Math.random() > 0.4 ? especieCanina : especieFelina; // 60% cães, 40% gatos
      const racasDaEspecie = todasRacas.filter(r => r.id_especie === especieAleatoria.id_especie);

      const novoAnimal = await prisma.animal.create({
        data: {
          nome: getRandomItem(nomesAnimais),
          data_nasc: getRandomDate(new Date(2015, 0, 1), new Date()), // Nascido entre 2015 e hoje
          sexo: Math.random() > 0.5 ? 'M' : 'F',
          id_tutor: novoTutor.id_tutor,
          id_raca: getRandomItem(racasDaEspecie).id_raca,
        },
      });
      animaisCriados.push(novoAnimal);
    }
  }
  console.log(`✅ ${tutoresCriados.length} novos tutores e ${animaisCriados.length} novos animais criados.`);

  // Criação de 30 consultas aleatórias
   console.log('🔄 Criando 30 consultas aleatórias (modelo atualizado)...');
  const consultasCriadas = [];
  for (let k = 0; k < 30; k++) {
    // Pega um animal aleatório da lista de animais que acabamos de criar
    const animalAleatorio = getRandomItem(animaisCriados); 
    
    const novaConsulta = await prisma.consulta.create({
        data: {
            // CORRIGIDO: O nome do campo agora é 'data'
            data: getRandomDate(new Date(2024, 0, 1), new Date()),
            
            // ADICIONADO: Campo obrigatório 'status'
            status: status_consulta_enum.finalizada, // Assumindo que este valor existe no seu enum
            
            // MANTIDO: Campos obrigatórios de relacionamento
            id_animal: animalAleatorio.id_animal,
            id_veterinario: drJose.id_veterinario,

            // REMOVIDO: 'motivo_consulta' e 'diagnostico' agora são opcionais e não foram solicitados.
        }
    });
    consultasCriadas.push(novaConsulta);
  }
  console.log(`✅ ${consultasCriadas.length} novas consultas criadas.`);
  // --- FIM DA NOVA SEÇÃO ---
}

main()
  .then(() => {
    console.log("🎉 Seeding completo! O banco de dados está pronto para uso.");
  })
  .catch((e) => {
    console.error("❌ Erro durante o seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });