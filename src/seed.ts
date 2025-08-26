import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Buscando estados e cidades do IBGE...");

  // Busca estados
  const estadosRes = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
  const estados = estadosRes.data;

  for (const estado of estados) {
    // Insere o estado
    const estadoCriado = await prisma.estado.create({
      data: {
        nome: estado.nome,
        uf: estado.sigla,
      },
    });

    // Busca cidades do estado
    const cidadesRes = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios`
    );
    const cidades = cidadesRes.data;

    // Insere todas as cidades
    await prisma.cidade.createMany({
      data: cidades.map((cidade: any) => ({
        nome: cidade.nome,
        id_estado: estadoCriado.id_estado,
      })),
      skipDuplicates: true, // evita erro caso já existam
    });

    console.log(`✅ Estado ${estado.nome} (${estado.sigla}) com ${cidades.length} cidades inseridas`);
  }
}

main()
  .then(() => {
    console.log("🎉 Estados e cidades inseridos com sucesso!");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });