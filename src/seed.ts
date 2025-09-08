import { PrismaClient, tipo_usuario_enum } from "@prisma/client";
import bcrypt from 'bcryptjs';
import axios from "axios";

const prisma = new PrismaClient();

// Listas de raças
const racasCaes = [ "Afegão Hound", "Affenpinscher", "Airedale Terrier", "Akita", "American Staffordshire Terrier",
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
  "Sem Raça Definida (SRD)" ];
  
const racasGatos = [ "Abissínio", "American Shorthair", "Angorá", "Ashera", "Azul Russo", "Bengal", "Bobtail Americano",
  "Bobtail Japonês", "Bombaim", "Burmês", "Chartreux", "Cornish Rex", "Devon Rex", "Exótico",
  "Himalaio", "Maine Coon", "Manx", "Munchkin", "Norueguês da Floresta", "Ocicat", "Oriental",
  "Persa", "Ragdoll", "Sagrado da Birmânia", "Savannah", "Scottish Fold", "Siamês", "Siberiano",
  "Singapura", "Somali", "Sphynx", "Tonquinês", "Toyger", "Sem Raça Definida (SRD)" ];


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
  console.log("✅ Cidades inseridas com sucesso!");

  // 3. POPULANDO ESPÉCIES E RAÇAS
  console.log('🐾 Criando espécies e raças...');
  const especieCanina = await prisma.especie.create({ data: { nome: 'Canina' } });
  const especieFelina = await prisma.especie.create({ data: { nome: 'Felina' } });
  
  const caesParaCriar = racasCaes.map(nome => ({ nome: nome, id_especie: especieCanina.id_especie }));
  await prisma.raca.createMany({ data: caesParaCriar });

  const gatosParaCriar = racasGatos.map(nome => ({ nome: nome, id_especie: especieFelina.id_especie }));
  await prisma.raca.createMany({ data: gatosParaCriar });
  console.log(`✅ ${racasCaes.length} raças de cães e ${racasGatos.length} raças de gatos criadas.`);

  // 4. CRIANDO DADOS DE EXEMPLO DA CLÍNICA
  console.log('🏥 Criando dados de exemplo da clínica...');
  
  // Criar Veterinário
  const drJose = await prisma.veterinario.create({
    data: {
      nome: 'Dr. José Lauro',
      cpf: '11122233344',
      crmv: 'CRMV-PR-12345',
    },
  });
  console.log('- Veterinário de exemplo criado.');

  // Criar Usuários
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
      id_veterinario: drJose.id_veterinario, // Vincula o usuário ao perfil de veterinário
    },
  });
  console.log('- Usuário admin e veterinário criados.');

  // Criar Tutor
  const pontaGrossa = await prisma.cidade.findFirst({ where: { nome: 'Ponta Grossa' } });
  const tutorExemplo = await prisma.tutor.create({
    data: {
      nome: 'Maria Clara Souza',
      cpf: '99988877766',
      telefone: '42988776655',
      id_cidade: pontaGrossa?.id_cidade, // Vincula à cidade de Ponta Grossa
    },
  });
  console.log('- Tutor de exemplo criado.');

  // Criar Animais
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